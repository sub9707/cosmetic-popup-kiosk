import type { MouseEvent, PointerEvent } from "react";

/**
 * 터치 화면용 누름 처리 — onClick 대신 버튼에 펼쳐 넣는다: <button {...pressHandlers(fn)}>
 *
 * click 은 "짧게, 움직이지 않고" 눌렀을 때만 생긴다. 행사장 대형 터치 모니터에서는 꾹 누르거나
 * (Windows 가 우클릭으로 처리) 누르다 손가락이 살짝 밀리는(스크롤로 판단돼 취소) 일이 잦아 버튼이
 * 안 먹힌다. 그래서 누른 시간·중간 움직임과 상관없이, 손을 뗀 위치가 그 버튼 위면 누른 것으로 친다.
 */
const pressed = new Map<number, Element>();

export function pressHandlers(onPress: () => void) {
  return {
    onPointerDown(e: PointerEvent<HTMLElement>) {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      pressed.set(e.pointerId, e.currentTarget);
      // 손가락이 버튼 밖으로 나갔다 들어와도 뗄 때의 pointerup 을 이 버튼이 받게 한다.
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    onPointerUp(e: PointerEvent<HTMLElement>) {
      if (pressed.get(e.pointerId) !== e.currentTarget) return;
      pressed.delete(e.pointerId);
      const releasedOn = document.elementFromPoint(e.clientX, e.clientY);
      if (releasedOn && e.currentTarget.contains(releasedOn)) onPress();
    },
    onPointerCancel(e: PointerEvent<HTMLElement>) {
      pressed.delete(e.pointerId);
    },
    // 포인터로 누른 건 위에서 이미 처리했다. 키보드(Enter/Space)로 누른 click 만 받는다.
    onClick(e: MouseEvent<HTMLElement>) {
      if (e.detail === 0) onPress();
    },
  };
}
