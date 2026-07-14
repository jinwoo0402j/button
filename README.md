# 버튼

버튼 누른다. 돈 받는다. 세상 사람 한 명 줄어든다.

조건을 숨기지 않는 한국어 단일 화면 버튼 게임 프로토타입이다. 짧은 단어와 단문, 설명을 덜어 낸 직접적인 표현을 이 프로젝트의 **케이브맨 문체**로 사용한다.

> 이 게임은 비그래픽 가상 실험이다. 실제 사람, 실제 죽음, 실제 지급과 관계없다. 표시 인구와 모든 추첨 확률은 추정치다. 피해자 프로필에는 실제 이름·도시·개인정보를 생성하거나 사용하지 않는다. 대상군도 실제 범죄·수형자 데이터와 무관한 가상 조건이며, 피해자 이름은 실제 개인과 무관한 합성 가상 이름이다.

- 저장소: <https://github.com/jinwoo0402j/button>
- 라이브 데모: <https://button-iota-one.vercel.app>
- 설계 원칙과 구현 우선순위: [`DESIGN.md`](DESIGN.md)
- 첫 핵심 루프 구현 계획: [`IMPLEMENTATION_PLAN.md`](IMPLEMENTATION_PLAN.md)
- 제품 제작 일정과 출시 예측: [`PRODUCTION_SCHEDULE.md`](PRODUCTION_SCHEDULE.md)

## 게임

화면 아래의 `[ 버튼 ]`을 누르거나 Space를 입력할 때마다 가상의 희생자 프로필이 추첨된다. 연달아 입력해도 각 국가/지역, 나이, 성별, 사인 룰렛이 독립적으로 돌며, 결과는 한 번 표시된 뒤 디졸브되어 시각 로그를 남기지 않는다. 클릭은 즉시 기록되고 브라우저 안의 돈이 입력당 100만 원 늘어난다. 사인 `버튼`은 현실 통계가 아닌 별도 1% 게임 확률이다.

화면은 검은 CRT 터미널처럼 구성한다. 본문과 숫자는 흰색, 보조 라벨은 회색, 진행 중인 룰렛은 호박색, 버튼·돈 증가는 초록색, 사망 결과는 적색 텍스트로만 구분한다. 메인 게임 화면에는 물리 패널이나 카드형 장식을 사용하지 않으며, 타이틀에서만 화면 중앙의 물리 버튼을 회색 점멸 조명으로 비춘다.

첫 방문은 작품명 `100만원 버튼`을 먼저 보여 준다. `[ 누르기 ]` 뒤 한국어, 흑백 남녀 프로필, 이름을 차례로 선택하면 우아한 여성 악마가 입력한 이름을 부르고 직장·빚·과로로 방에 끌려온 배경과 버튼의 죽음·100만 원·룰렛 규칙을 하나의 악마의 방 씬 안에서 19개 대사 비트로 설명한다. 각 비트는 320px 이상 화면에서 실제 최대 두 줄로 표시되며, 본문은 글자 단위로 나타나면서 효과음 켬·끔 설정을 따르는 낮고 부드러운 합성 비프음을 낸다. 진행 입력은 타이핑 중이면 전문을 먼저 표시하고 완료 뒤 다음 비트로 넘어간다. 짧은 디졸브는 타이틀·설정·악마의 방·윤리 선택·게임 또는 조기 엔딩 사이의 의미 경계에만 적용하고, 설정 단계·대사 비트·윤리 조건 내부 변경은 즉시 갱신한다. 같은 탭에서 이미 대상을 선택했다면 새로고침 뒤에는 타이틀과 설정·도입을 반복하지 않고 게임을 바로 복원한다. 조건을 받아들이면 중앙의 `내 돈`과 별도 실행 버튼이 나타난다. 돈이 오르는 순간에는 숫자가 초록색으로 바뀌며, 화면 최하단의 버튼도 긍정적인 초록색으로 표시한다. 오른쪽 위 목표는 `1000만원 → 1억 → 3억 → 5억 → 10억 → 50억 → 100억` 순서로 하나씩 열린다. 목표 보상은 진행률, Space 홀드 입력, 단계별 룰렛 가속과 전체 목표 신호이며 모든 해금 상태는 누적 클릭 수에서 계산한다.

표시 인구는 다음 브라우저별 추정식으로 계산한다.

```text
8,199,768,010
+ floor((현재 UTC - 2026-07-11T12:58:15Z) / 1초) × 2
- 이 브라우저의 누적 클릭 수
```

기준 인구는 **8,199,768,010명**, 기준 시각은 **2026-07-11T12:58:15Z**다. 초당 2명 순증가를 가정하며, 다른 방문자의 클릭은 반영하지 않는다.

## 로컬 실행과 테스트

빌드 단계와 설치할 런타임 의존성이 없는 정적 사이트다.

```bash
python -m http.server 8000
```

브라우저에서 <http://localhost:8000>을 연다.

```bash
node --test
```

테스트는 인구 계산, 상태 저장과 복원, 가중 추첨 경계, 연속 클릭 기록, UI 계약과 통계 표본을 검사한다.

## 데이터와 출처

### 인구 분포

[UN World Population Prospects 2024](https://www.un.org/development/desa/pd/content/world-population-prospects-2024-dataset)의 **2026 Medium** 자료를 국가/지역, 단일 연령 `0~99·100+`, 남성·여성 가중치로 번역·정규화해 정적 파일에 포함한다. 원자료의 라이선스는 [Creative Commons Attribution 3.0 IGO (CC BY 3.0 IGO)](https://creativecommons.org/licenses/by/3.0/igo/)다.

### 사인 분포

[WHO의 2021년 세계 상위 10개 사망원인 공개 집계](https://www.who.int/news-room/fact-sheets/detail/the-top-10-causes-of-death)만 `상위 10개 + 기타`의 독립 가중치로 사용한다. WHO 전체 원자료는 저장소에 포함하지 않는다. 자세한 재사용 조건은 [WHO data policy](https://www.who.int/about/policies/publishing/data-policy/terms-and-conditions)를 따른다.

`사인: 버튼` 1%는 WHO 통계가 아닌 블랙코미디용 게임 규칙이다. 나머지 현실 사인 가중치는 99% 안에서 적용한다. 이 프로젝트는 UN 또는 WHO가 승인·후원하거나 제휴한 프로젝트가 아니다.

### 제3자 글꼴

화면은 [Galmuri11 Bold v2.40.3](https://github.com/quiple/galmuri/releases/tag/v2.40.3)을 로컬 웹폰트로 사용한다. Copyright © 2019–2025 Lee Minseo. 글꼴은 SIL Open Font License 1.1로 별도 배포되며, 라이선스 원문은 [`assets/fonts/Galmuri-OFL-1.1.md`](assets/fonts/Galmuri-OFL-1.1.md)에 포함한다. Reserved Font Name은 “Galmuri”다.

### 제3자 효과음

메인 버튼·비주얼 노벨 진행과 선택·룰렛에는 OpenGameArt의 [87 Clickety Clips](https://opengameart.org/content/87-clickety-clips)와 [Mechanical Sounds](https://opengameart.org/content/mechanical-sounds)에서 고른 실물 녹음 효과음 다섯 개를 사용한다. 두 묶음은 모두 CC0이며, 원본 `click17.wav`, `click29.wav`, `click28.wav`, `click82.wav`, `lightclunk1.wav`를 내용 수정 없이 의미 기반 파일명으로 저장한다. 비주얼 노벨 클릭은 정상 처리된 진행·설정·윤리 선택에만 재생하고 차단되거나 유효하지 않은 입력에는 재생하지 않는다.

### 프로젝트 음악

사용자가 제공한 `Neon Static`을 타이틀 연주곡으로 사용한다. 브라우저가 허용하는 첫 사용자 입력에서 시작해 역할 설정까지 이어지고, 악마가 처음 등장하면 `The Contract Salon`으로 교체된다. `The Contract Salon`은 2026년 7월 13일 활성 Suno Pro 구독에서 만든 프로젝트 전용 연주곡이며 별도의 재사용 라이선스는 부여하지 않는다. Suno의 [공식 약관](https://suno.com/terms/)은 유료 구독 중 생성된 출력에 대한 권리 이전을 명시하지만 저작권 성립 자체는 보증하지 않으며, [권리 안내](https://help.suno.com/en/articles/2416769)도 생성 당시 구독 상태를 기준으로 설명한다.

## 상태와 개인정보

게임 상태는 `jinwoo-button:v1` 키로 각 브라우저의 `localStorage`에만 저장된다. 누적 클릭 수로 돈을 다시 계산하고 마지막 가상 희생자 프로필을 복원한다. 저장소가 손상됐거나 차단되면 현재 탭의 메모리 상태로 대체한다.

효과음 켬·끔 선택은 `jinwoo-button:sfx:v1` 키로 같은 브라우저의 `localStorage`에 저장한다. 저장이 차단되어도 현재 페이지의 음소거 상태와 게임 진행은 유지된다.

음악 켬·끔 선택은 별도의 `jinwoo-button:bgm:v1` 키에 저장한다. 음악과 효과음은 독립적으로 끌 수 있으며, 로컬 음원 로드나 디코딩이 실패해도 게임은 무음으로 계속된다.

선택 언어·프로필·플레이어 이름은 `jinwoo-button:player:v1` 키로 현재 탭의 `sessionStorage`에만 저장되고 탭을 닫으면 사라진다. 계정이나 서버로 전송하지 않는다.

앱 전용 서버, 계정, 분석 도구, 추적 코드가 없다. 페이지를 받은 뒤 게임 데이터나 통계를 가져오기 위한 외부 런타임 API 요청도 없다. 상태는 방문자 사이에서 공유되지 않는다.

## 구조와 배포

- `index.html`: 단일 화면 마크업과 인라인 스타일
- `game.js`: 추첨, 상태, 애니메이션, 접근성 동작
- `assets/profile-options.png`: 흑백 남녀 플레이어 프로필 시트
- `assets/audio/*`: 프로젝트 BGM과 CC0 실물 녹음 버튼·룰렛 효과음
- `assets/fonts/*`: Galmuri11 Bold 웹폰트와 OFL 1.1
- `stats.generated.js`: 브라우저에서 사용하는 생성된 압축 가중치
- `scripts/build-stats.py`: 통계 데이터 생성·검증 도구
- `tests/*.test.mjs`: Node 내장 테스트 러너 테스트

Vercel에서 GitHub 저장소를 Import한 뒤 프로젝트 이름을 `button`, Framework Preset을 `Other`로 둔다. Build Command는 비워 두고 Root Directory와 Output Directory는 저장소 루트 `.`을 사용하며 Production Branch는 `main`으로 설정한다. 이후 `main` 푸시가 정적 사이트를 자동 배포한다.

프로덕션은 <https://button-iota-one.vercel.app>에서 확인할 수 있다.
