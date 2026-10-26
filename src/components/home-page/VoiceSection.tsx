import { Reveal } from "../animation/Reveal";
import { VoiceCard } from "./VoiceCard";

const VOICES = [
  {
    quote:
      "Hồi bé từng là 1 cậu bé ngây thơ hồn nhiên và tò mò với mọi thứ và mọi chuyện bắt đầu từ sau khi bố tôi mất sớm,tôi lúc đó đã có 1 cảm nhận khác về mẹ của mình,mẹ tôi lúc đó không thể trải qua được cú sock khi bố tôi vừa mất,mẹ tôi nuôi tôi và chị gái trong 1 cuộc sống áp lực,lo lắng và sợ hãi,lúc đó tôi có 1 cảm nhận khác về mẹ khi mẹ không còn nhẹ nhàng với tôi,không còn kiên nhẫn với tôi và luôn đánh đập và chửi mắng tôi những câu tệ nhất,đau nhất mà mẹ tôi có thể nghĩ được và lúc đó tôi có 1 suy nghĩ,tôi mong tôi lớn,thoát khỏi mẹ thoát khỏi chính gia đình mình,tôi cứ tiếp tục sống trong môi trường thế cho tới khi tôi 15-16 tuổi,tôi quyết định nghỉ học và vội khép lại cánh cửa là cơ hội của chính mình,tôi lúc đó đi làm công ty và lúc đó tôi gặp những người bạn nghịch ngợm và tôi nghĩ họ hiểu tôi hơn gia đình mình.Sau đó tôi bắt đầu chìm vào tệ nạn,những lần đi chơi thâu đêm,những cuộc đánh nhau,hút hít... Và khi tôi nhận thức ra khi tôi ra bên ngoài tôi luôn bị lừa lọc,lợi dụng và tôi nhìn lại chính mình,tôi sợ bản thân mình,tôi nhìn chính mình trong gương,mất tôi thâm cuồng không còn sự vui vẻ,ngây thơ và hồn nhiên trong đó và khi tôi về với gia đình mình tôi nhìn mọi người vui vẻ nói chuyện trong bữa cơm,tôi không nói gì chỉ biết quan sát mọi người và tôi cảm thấy mình không thực sự thuộc về sự hạnh phúc ấy,tôi bắt đầu đóng cửa trái tim mình lại tôi chìm vào game,tôi chơi thâu đêm suốt sáng,ăn,rồi ngủ và khi ngủ dậy tôi lại tiếp tục vòng lặp đó rồi khi bác tôi dìu dắt tôi vào môi trường này tôi thay đổi cách nghĩ của mình và đâu đó nhỡ đâu tôi có thể sống lại 1 cuộc đời hoàn toàn khác với cuộc sống trước kia",
    who: "Đại Hiếu - Khai phóng bản thân 2026",
    image: "/images/hieu.webp",
    imagePosition: "50% 65%",
  },
  {
    quote:
      "Hành trình lớn lên của tôi đi qua những đầu rẫy sự tổn thương . Tôi nghĩ tôi không bước qua đến nó có những lần tôi nghĩ tại sao tôi lại không may mắn như người khác, ông trời lại bất công với tôi . Tôi thiệt thòi hơn các bạn thiếu tình thương của bố , cơ thể còn bị khiếm khuyết. Luôn bị gắn mác trong người là lùn và mọi người còn đặt biệt danh cho tôi là Lệ Lùn . Mặc dù tôi không chấp nhận nhưng tôi đã bị chai xạm cảm xúc suốt mười mấy năm qua, bên trong tôi không chấp nhận điều đó mỗi lần bị trêu chọc thì tôi rất khó chịu và tủi thân. Ra ngoài suốt ngày bị trêu chọc khiến tôi không tự tin vào bản thân cho mình lùn mình xấu . Nhiều lúc thấy các bạn múa tôi cũng thèm thuồng lắm , ai mà không ước mình được xinh đẹp tự tin trên sân khấu và toả sáng . Ước mơ ngành giáo viên mầm non của tôi cũng bị dập tắt vào cái khoảng khắc tôi gọi cho nhà trường để làm hồ sơ nhập học người ta bảo không nhận người giưới m4.Tôi đã bắt đầu chấp nhận bản thân mình chính những khiếm khuyết của bản thân tôi biến nó thành viên kim cương toả sáng theo cách của riêng mình.Nghịch cảnh sinh ra để tôi luyện bản lĩnh, giúp bạn tỏa sáng theo cách riêng. Tôi đã bắt đầu chấp nhận bản thân mình chính những khiếm khuyết của bản thân tôi biến nó thành viên kim cương toả sáng theo cách của riêng mình. Nghịch cảnh sinh ra để tôi luyện bản lĩnh, giúp bạn tỏa sáng theo cách riêng.",
    who: "Nhật Lệ - Khai phóng bản thân 2026",
    image: "/images/nhat-le.webp",
    imagePosition: "50% 35%",
  },
  // {
  //   quote:
  //     "Tôi đã bắt đầu chấp nhận bản thân mình chính những khiếm khuyết của bản thân tôi biến nó thành viên kim cương toả sáng theo cách của riêng mình. Nghịch cảnh sinh ra để tôi luyện bản lĩnh, giúp bạn tỏa sáng theo cách riêng.",
  //   who: "Yến",
  // },
];
const GRID_COLS: Record<number, string> = {
  1: "md:grid-cols-1 md:mx-auto md:max-w-2xl",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
};
export function VoicesSection() {
  const gridCols = GRID_COLS[Math.min(VOICES.length, 3)];

  return (
    <section id="voices" className="relative overflow-hidden bg-blue py-28">
      <div className="pointer-events-none absolute right-0 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-yellow/10 blur-3xl" />

      <div className="relative mx-auto max-w-[var(--page-w)] px-6">
        <div className="mb-4 flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-widest text-yellow">
          <span className="block h-px w-6 bg-yellow" />
          Những câu chuyện thật
        </div>
        <h2 className="mb-16 font-display text-4xl font-bold text-white">
          Từ những người đã đi cùng
        </h2>

        {/* items-start: mở rộng một thẻ không kéo giãn thẻ còn lại */}
        <div className={`grid grid-cols-1 items-start gap-6 ${gridCols}`}>
          {VOICES.map((v, i) => (
            <Reveal
              key={v.who}
              direction={i % 2 === 0 ? "left" : "right"}
              delay={i * 100}
            >
              <VoiceCard {...v} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
