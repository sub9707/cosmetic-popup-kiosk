import type { EventSurveyQuestion } from "@shared/types";
import type { Lang } from "./i18n";

/**
 * 설문 문항 (언어별). 앱에 그대로 번들되므로 문항을 바꾸려면 여기를 고치고 다시 빌드한다.
 * 모든 언어가 같은 id·순서·A~D 를 가져야 한다 — 답변은 라벨(A~D)로만 저장된다.
 * q5 는 마지막 줄(제품명)을 굵게 보여주므로(CHOICE_EMPHASIS) 번역도 제품명을 마지막 줄에 둔다.
 */
export const QUESTIONS: Record<Lang, EventSurveyQuestion[]> = {
  ko: [
    {
      id: "q1",
      order: 1,
      question: "'바이오던스(BIODANCE)'를\n평소에 알고 계셨나요?",
      choices: {
        A: "바이오던스 찐팬!\n이미 사용하고 있는 제품이 있어요.",
        B: "사용해본 적은 없지만,\n올리브영이나 SNS에서 자주 봤어요.",
        C: "이름은 들어봤지만,\n어떤 제품이 있는지는 잘 몰라요.",
        D: "이번 팝업을 통해\n처음 알게 되었어요!",
      },
    },
    {
      id: "q2",
      order: 2,
      question: "'콜라겐 스킨케어' 하면\n가장 먼저 어떤 생각이 드나요?",
      choices: {
        A: "아직은 나와 먼 이야기!\n나중에 피부 탄력이 고민될 때 시작하면 될 것 같아요.",
        B: "탄력·주름 관리가 먼저 떠올라요.\n피부 노화 관리에 필요한 스킨케어 같아요.",
        C: "쫀쫀하고 탱탱한 피부!\n피부 컨디션을 탄탄하게 관리해줄 것 같아요.",
        D: "매일 가볍게 시작하는 데일리 케어!\n지금부터 꾸준히 챙겨야 좋을 것 같아요.",
      },
    },
    {
      id: "q3",
      order: 3,
      question: "평소 나의 스킨케어 스타일에\n가장 가까운 것은?",
      choices: {
        A: "심플 이즈 베스트!\n꼭 필요한 제품만 가볍게 챙겨요.",
        B: "화잘먹이 제일 중요해!\n메이크업 전 피부 컨디션을 꼼꼼하게 챙겨요.",
        C: "수분·광채는 틈틈이!\n건조하거나 생기가 필요할 때 바로바로 채워줘요.",
        D: "스페셜 케어도 놓칠 수 없어!\n중요한 날에는 마스크팩까지 꼼꼼하게 챙겨요.",
      },
    },
    {
      id: "q4",
      order: 4,
      question: "오늘 나의 메이크업 상황에\n가장 가까운 것은?",
      choices: {
        A: "오늘은 쌩얼 DAY!\n메이크업 없이 기초 스킨케어만으로 편안하게 보내는 중이에요.",
        B: "가볍게 꾸미는 데일리 DAY!\n얇고 산뜻한 베이스로 자연스럽게 메이크업했어요.",
        C: "오늘은 제대로 FULL MAKE-UP DAY!\n오랫동안 메이크업을 유지해야 해서 수시로 피부 컨디션을 유지하고 싶어요.",
        D: "내일은 정말 중요한 D-DAY!\n내일 화장이 잘 먹도록 오늘 집중 관리할 예정이에요.",
      },
    },
    {
      id: "q5",
      order: 5,
      question: "바이오던스 콜라겐 라인 중\n가장 궁금하거나 써보고 싶은 제품은?",
      choices: {
        A: "메이크업 전 피부결을 쫀쫀하게 준비해주는\n콜라겐 세럼",
        B: "필요할 때 간편하게 수분을 채워주는\n콜라겐 젤리 미스트",
        C: "중요한 날 전 피부 컨디션을 집중 케어하는\n콜라겐 마스크팩",
        D: "다른 콜라겐 제품도 궁금해요!\n버블 부스터, 아이패치 등",
      },
    },
  ],
  zh: [
    {
      id: "q1",
      order: 1,
      question: "您之前听说过\n'BIODANCE'吗？",
      choices: {
        A: "BIODANCE铁粉！\n已经在用他们家的产品了。",
        B: "还没用过，\n但在Olive Young或社交媒体上经常看到。",
        C: "听说过名字，\n但不太了解有哪些产品。",
        D: "通过这次快闪店\n第一次知道！",
      },
    },
    {
      id: "q2",
      order: 2,
      question: "提到'胶原蛋白护肤'，\n您首先想到什么？",
      choices: {
        A: "离我还很远！\n等以后在意皮肤弹性时再开始就好。",
        B: "首先想到紧致和抗皱。\n感觉是抗老护理必备的护肤品。",
        C: "Q弹饱满的肌肤！\n能让肌肤状态更紧致。",
        D: "每天轻松开始的日常护理！\n从现在开始坚持会更好。",
      },
    },
    {
      id: "q3",
      order: 3,
      question: "哪一项最接近\n您平时的护肤风格？",
      choices: {
        A: "简单就是最好！\n只用必需的产品，轻松护理。",
        B: "妆容服帖最重要！\n化妆前会仔细打理肌肤状态。",
        C: "随时补水提亮！\n干燥或需要气色时马上补充。",
        D: "特别护理也不能少！\n重要的日子连面膜都会认真敷。",
      },
    },
    {
      id: "q4",
      order: 4,
      question: "哪一项最接近\n您今天的妆容状态？",
      choices: {
        A: "今天素颜DAY！\n不化妆，只做基础护肤轻松度过。",
        B: "轻妆日常DAY！\n用轻薄清爽的底妆化了自然妆容。",
        C: "今天是全妆DAY！\n妆容需要长时间保持，想随时维持肌肤状态。",
        D: "明天是超重要的D-DAY！\n打算今天集中护理，让明天的妆更服帖。",
      },
    },
    {
      id: "q5",
      order: 5,
      question: "BIODANCE胶原蛋白系列中\n您最想尝试哪款产品？",
      choices: {
        A: "化妆前让肌肤Q弹细腻\nCollagen Serum",
        B: "随时随地轻松补水\nCollagen Jelly Mist",
        C: "重要日子前集中护理肌肤\nCollagen Mask",
        D: "也想了解其他胶原蛋白产品！\nBubble Booster、Eye Patch等",
      },
    },
  ],
  ja: [
    {
      id: "q1",
      order: 1,
      question: "「BIODANCE」を\nご存じでしたか？",
      choices: {
        A: "BIODANCEの大ファン！\nすでに使っている製品があります。",
        B: "使ったことはないけど、\nOlive YoungやSNSでよく見かけます。",
        C: "名前は聞いたことがあるけど、\nどんな製品があるかはよく知りません。",
        D: "このポップアップで\n初めて知りました！",
      },
    },
    {
      id: "q2",
      order: 2,
      question: "「コラーゲンスキンケア」と聞いて\nまず何を思い浮かべますか？",
      choices: {
        A: "まだ私には早いかも！\nハリが気になり始めたら始めればいいと思います。",
        B: "ハリ・シワケアが思い浮かびます。\nエイジングケアに必要なスキンケアだと思います。",
        C: "もちもちでハリのある肌！\n肌のコンディションを整えてくれそうです。",
        D: "毎日気軽に始めるデイリーケア！\n今から続けるのが良さそうです。",
      },
    },
    {
      id: "q3",
      order: 3,
      question: "普段のスキンケアスタイルに\n一番近いのは？",
      choices: {
        A: "シンプルイズベスト！\n必要なアイテムだけ軽くケアします。",
        B: "化粧ノリが一番大事！\nメイク前の肌コンディションをしっかり整えます。",
        C: "うるおい・ツヤはこまめに！\n乾燥やくすみが気になったらすぐにチャージします。",
        D: "スペシャルケアも欠かせない！\n大事な日にはシートマスクまでしっかりケアします。",
      },
    },
    {
      id: "q4",
      order: 4,
      question: "今日のメイクに\n一番近いのは？",
      choices: {
        A: "今日はすっぴんDAY！\nメイクなしで基礎スキンケアだけで過ごしています。",
        B: "ナチュラルメイクのデイリーDAY！\n薄くて軽いベースで自然にメイクしました。",
        C: "今日はしっかりフルメイクDAY！\nメイクを長時間キープしたいので、こまめに肌を整えたいです。",
        D: "明日はとても大事なD-DAY！\n明日の化粧ノリのために今日は集中ケアする予定です。",
      },
    },
    {
      id: "q5",
      order: 5,
      question: "BIODANCEのコラーゲンラインで\n一番気になる・使ってみたい製品は？",
      choices: {
        A: "メイク前の肌をもっちり整える\nCollagen Serum",
        B: "いつでも手軽にうるおいチャージ\nCollagen Jelly Mist",
        C: "大事な日の前に集中ケア\nCollagen Mask",
        D: "ほかのコラーゲン製品も気になる！\nBubble Booster、Eye Patchなど",
      },
    },
  ],
  en: [
    {
      id: "q1",
      order: 1,
      question: "Have you heard of\nBIODANCE before?",
      choices: {
        A: "A true BIODANCE fan!\nI'm already using their products.",
        B: "Haven't tried it yet,\nbut I've seen it at Olive Young or on social media.",
        C: "I've heard the name,\nbut I'm not sure what products they have.",
        D: "This pop-up is the first time\nI've heard of it!",
      },
    },
    {
      id: "q2",
      order: 2,
      question: "What comes to mind first\nwith 'collagen skincare'?",
      choices: {
        A: "Not for me yet!\nI'll start when skin firmness becomes a concern.",
        B: "Firming and wrinkle care.\nIt feels like anti-aging skincare.",
        C: "Bouncy, plump skin!\nIt keeps my skin firm and in good condition.",
        D: "An easy daily routine!\nBest to start now and stay consistent.",
      },
    },
    {
      id: "q3",
      order: 3,
      question: "Which best describes\nyour usual skincare style?",
      choices: {
        A: "Simple is best!\nI keep it light with only the essentials.",
        B: "Makeup-ready skin is everything!\nI prep my skin carefully before makeup.",
        C: "Hydration & glow on the go!\nI top up whenever my skin feels dry or dull.",
        D: "Special care is a must!\nOn big days, I go all in with a sheet mask.",
      },
    },
    {
      id: "q4",
      order: 4,
      question: "Which best describes\nyour makeup today?",
      choices: {
        A: "Bare-face day!\nNo makeup, just a comfy basic skincare routine.",
        B: "Light daily look!\nA thin, fresh base for a natural finish.",
        C: "Full makeup day!\nMy makeup has to last, so I want to keep my skin fresh all day.",
        D: "Big D-Day tomorrow!\nIntensive care tonight so my makeup sits perfectly.",
      },
    },
    {
      id: "q5",
      order: 5,
      question: "Which BIODANCE collagen product\nwould you most like to try?",
      choices: {
        A: "Preps smooth, bouncy skin before makeup\nCollagen Serum",
        B: "Hydrates easily whenever you need it\nCollagen Jelly Mist",
        C: "Intensive care before a big day\nCollagen Mask",
        D: "Curious about other collagen products!\nBubble Booster, Eye Patch & more",
      },
    },
  ],
};
