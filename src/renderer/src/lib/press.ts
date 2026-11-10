import type { MouseEvent, PointerEvent } from "react";

/*
 * 터치 화면용 버튼 누름 처리. onClick 대신 사용한다: <button {...pressHandlers(fn)}>
 *
 * 대형 터치 모니터에서는 길게 누르거나(우클릭으로 처리) 누르는 중 손가락이 밀리면(스크롤로 판단)
 * click 이 발생하지 않는다. 누른 시간이나 이동과 관계없이 손을 뗀 위치가 버튼 위면 누른 것으로 처리한다.
 */
const pressed = new Map<number, Element>();

export function pressHandlers(onPress: () => void) {
  return {
    onPointerDown(e: PointerEvent<HTMLElement>) {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      pressed.set(e.pointerId, e.currentTarget);
      // 버튼 밖으로 벗어났다 돌아와도 pointerup 을 받을 수 있도록 캡처
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
    // 포인터 입력은 위에서 처리하므로 키보드(Enter/Space)로 발생한 click 만 처리
    onClick(e: MouseEvent<HTMLElement>) {
      if (e.detail === 0) onPress();
    },
  };
}
