# EventKiosk

B사 오프라인 팝업 행사용 세로형 터치 키오스크 앱입니다.
설문 5문항에 답하면 답변에 맞는 스킨케어 루틴을 추천해 줍니다.
서버나 인터넷 연결 없이 로컬 파일만으로 동작합니다.

## 주요 기능

- 메인 → 설문 5문항 → 추천 로딩 → 결과 화면
- 참여 기록을 로컬 파일에 즉시 저장 (개인정보 미수집)
- 설정 화면(비밀번호)에서 참여자 수 확인, Excel 다운로드, 효과음 설정

## 기술 스택

Electron, electron-vite, React 19, TypeScript, Tailwind CSS v4, exceljs

## 실행 및 빌드

```bash
npm install
npm run dev    # 개발 모드 (일반 창)
npm run dist   # Windows 설치 파일 생성 → release/
```

설치된 앱은 전체화면 키오스크 모드로 실행됩니다.

## 데이터 위치

```
%APPDATA%\EventKiosk\
  config\questions.json   설문 문항 (직접 수정 가능)
  data\YYYY-MM-DD.jsonl   날짜별 참여 기록
  logs\YYYY-MM-DD.log     오류 로그
```
