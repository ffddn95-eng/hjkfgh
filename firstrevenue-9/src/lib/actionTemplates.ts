export const siteTemplates = {
  reddit: {
    name: "Reddit",
    baseUrl: "https://www.reddit.com/search/",
    genericSteps: [
      "검색 페이지를 엽니다.",
      "AI가 생성한 검색어를 검색창에 입력합니다.",
      "댓글이 많은 게시글을 우선 확인합니다.",
      "반복되는 불만, 대체재 불만, 가격 불만을 기록합니다."
    ],
    usefulFor: ["customer_pain", "community_research", "problem_validation"]
  },
  productHunt: {
    name: "Product Hunt",
    baseUrl: "https://www.producthunt.com/search",
    genericSteps: [
      "검색창에 핵심 키워드를 입력합니다.",
      "최근 출시된 유사 제품을 확인합니다.",
      "업보트 수, 댓글 수, 포지셔닝 문구를 확인합니다.",
      "댓글에서 사람들이 왜 관심을 가졌는지 확인합니다."
    ],
    usefulFor: ["competitor_research", "positioning", "market_signal"]
  },
  appStore: {
    name: "App Store",
    baseUrl: "https://www.apple.com/app-store/",
    genericSteps: [
      "앱스토어에서 핵심 키워드를 검색합니다.",
      "상위 앱 5개를 확인합니다.",
      "낮은 평점 리뷰를 우선 확인합니다.",
      "반복되는 불만과 유료 기능을 기록합니다."
    ],
    usefulFor: ["mobile_app_validation", "review_mining", "competitor_research"]
  },
  googleTrends: {
    name: "Google Trends",
    baseUrl: "https://trends.google.com/",
    genericSteps: [
      "핵심 키워드를 입력합니다.",
      "최근 12개월 또는 5년 추세를 확인합니다.",
      "지역별 관심도와 관련 검색어를 확인합니다.",
      "시장 관심이 증가 중인지 감소 중인지 판단합니다."
    ],
    usefulFor: ["demand_trend", "keyword_validation"]
  }
};

export type IdeaCategory =
  | "b2b_saas"
  | "consumer_app"
  | "marketplace"
  | "ecommerce"
  | "creator_tool"
  | "info_product"
  | "local_service"
  | "other";

export function getExecutionRoute(category: IdeaCategory) {
  switch (category) {
    case "b2b_saas":
      return ["linkedin", "reddit", "google", "competitor_site", "cold_email"];
    case "consumer_app":
      return ["tiktok", "app_store", "reddit", "landing_page", "waitlist"];
    case "marketplace":
      return ["supply_research", "demand_research", "manual_matching", "tally", "payment"];
    case "ecommerce":
      return ["amazon", "etsy", "tiktok", "meta_ads_library", "shopify"];
    default:
      return ["google", "reddit", "landing_page", "outreach"];
  }
}
