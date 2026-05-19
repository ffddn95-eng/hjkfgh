import { db, handleFirestoreError, OperationType } from './firebase';
import { collection, doc, setDoc, getDoc, getDocs, query, orderBy, serverTimestamp, updateDoc } from 'firebase/firestore';

export const analyzeIdea = async (ideaText: string, userId: string): Promise<string> => {
  try {
    const response = await fetch("/api/analyzeIdea", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ideaText, userId })
    });

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      throw new Error(`Server returned non-JSON response. Ensure Express server is running. Response start: ${text.substring(0, 50)}`);
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to analyze idea.");
    }

    const aiResult = await response.json();

    const ideasRef = collection(db, 'ideas');
    const newIdeaRef = doc(ideasRef); // auto-generated ID
    
    try {
      await setDoc(newIdeaRef, {
        userId,
        ideaText,
        result: {
          idea: aiResult.idea,
          ruthlessVerdict: aiResult.ruthlessVerdict,
          scores: aiResult.scores,
          fatalRisks: aiResult.fatalRisks,
          hooks: aiResult.hooks,
          pivots: aiResult.pivots
        },
        status: "validation",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      const actionsRef = collection(newIdeaRef, 'actions');
      for (const action of aiResult.executionPlan) {
        const actionDocRef = doc(actionsRef, action.id || doc(actionsRef).id);
        await setDoc(actionDocRef, {
          ...action,
          status: action.day === 1 ? 'todo' : 'locked',
          createdAt: serverTimestamp()
        });
      }

      return newIdeaRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `ideas/${newIdeaRef.id}`);
      throw error;
    }

  } catch (e: any) {
    console.error("error:", e);
    throw e;
  }
};

export const getIdea = async (ideaId: string) => {
  const docRef = doc(db, 'ideas', ideaId);
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `ideas/${ideaId}`);
  }
  return null;
};

export const getIdeaActions = async (ideaId: string) => {
  const actionsRef = collection(db, `ideas/${ideaId}/actions`);
  const q = query(actionsRef, orderBy('day', 'asc'));
  try {
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ ...d.data(), id: d.id }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, `ideas/${ideaId}/actions`);
    return [];
  }
};

export const updateActionEvidence = async (ideaId: string, actionId: string, evidenceData: any) => {
  const actionRef = doc(db, `ideas/${ideaId}/actions`, actionId);
  try {
    await updateDoc(actionRef, {
      evidence: evidenceData,
      status: 'completed',
      updatedAt: serverTimestamp()
    });

    const actionsRef = collection(db, `ideas/${ideaId}/actions`);
    const q = query(actionsRef, orderBy('day', 'asc'));
    const snap = await getDocs(q);
    const actions = snap.docs.map(d => ({ ...(d.data() as any), id: d.id, ref: d.ref }));
    
    // Find the current action and unlock the next one if it exists
    const currentIndex = actions.findIndex(a => a.id === actionId);
    if (currentIndex !== -1 && currentIndex < actions.length - 1) {
      const nextAction = actions[currentIndex + 1];
      if (nextAction.status === 'locked') {
        await updateDoc(nextAction.ref, {
          status: 'todo',
          updatedAt: serverTimestamp()
        });
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `ideas/${ideaId}/actions/${actionId}`);
  }
};
