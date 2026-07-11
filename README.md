# 버튼

버튼 누른다. 돈 받는다. 세상 사람 한 명 줄어든다.

조건을 숨기지 않는 한국어 단일 화면 버튼 게임 프로토타입이다. 짧은 단어와 단문, 설명을 덜어 낸 직접적인 표현을 이 프로젝트의 **케이브맨 문체**로 사용한다.

> 이 게임은 비그래픽 가상 실험이다. 실제 사람, 실제 죽음, 실제 지급과 관계없다. 표시 인구와 모든 추첨 확률은 추정치다. 실제 이름·도시·개인정보를 생성하거나 사용하지 않는다.

- 저장소: <https://github.com/jinwoo0402j/button>
- 라이브 데모: <https://button-iota-one.vercel.app>

## 게임

화면 아래의 `[ 버튼 ]`을 누르거나 Space를 입력할 때마다 가상의 희생자 프로필이 추첨된다. 연달아 입력해도 각 국가/지역, 나이, 성별, 사인 룰렛이 독립적으로 돌며, 결과는 한 번 표시된 뒤 디졸브되어 시각 로그를 남기지 않는다. 클릭은 즉시 기록되고 브라우저 안의 돈이 입력당 100만 원 늘어난다. 사인 `버튼`은 현실 통계가 아닌 별도 1% 게임 확률이다.

화면은 검은 CRT 터미널처럼 구성한다. 본문과 숫자는 흰색, 보조 라벨은 회색, 진행 중인 룰렛은 호박색, 버튼·돈 증가는 초록색, 사망 결과는 적색 텍스트로만 구분하며 물리 패널이나 카드형 장식은 사용하지 않는다.

도입 문구는 한 번 출력된 뒤 사라지고 중앙의 `내 돈`으로 교체된다. 돈이 오르는 순간에는 숫자가 초록색으로 바뀌며, 화면 최하단의 버튼도 긍정적인 초록색으로 표시한다. 오른쪽 위 목표는 `1000만원 → 1억 → 3억 → 5억 → 10억 → 50억 → 100억` 순서로 하나씩 열린다. 목표 보상은 진행률, Space 홀드 입력, 단계별 룰렛 가속과 전체 목표 신호이며 모든 해금 상태는 누적 클릭 수에서 계산한다.

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

## 상태와 개인정보

게임 상태는 `jinwoo-button:v1` 키로 각 브라우저의 `localStorage`에만 저장된다. 누적 클릭 수로 돈을 다시 계산하고 마지막 가상 희생자 프로필을 복원한다. 저장소가 손상됐거나 차단되면 현재 탭의 메모리 상태로 대체한다.

앱 전용 서버, 계정, 분석 도구, 추적 코드가 없다. 페이지를 받은 뒤 게임 데이터나 통계를 가져오기 위한 외부 런타임 API 요청도 없다. 상태는 방문자 사이에서 공유되지 않는다.

## 구조와 배포

- `index.html`: 단일 화면 마크업과 인라인 스타일
- `game.js`: 추첨, 상태, 애니메이션, 접근성 동작
- `assets/fonts/*`: Galmuri11 Bold 웹폰트와 OFL 1.1
- `stats.generated.js`: 브라우저에서 사용하는 생성된 압축 가중치
- `scripts/build-stats.py`: 통계 데이터 생성·검증 도구
- `tests/*.test.mjs`: Node 내장 테스트 러너 테스트

Vercel에서 GitHub 저장소를 Import한 뒤 프로젝트 이름을 `button`, Framework Preset을 `Other`로 둔다. Build Command는 비워 두고 Root Directory와 Output Directory는 저장소 루트 `.`을 사용하며 Production Branch는 `main`으로 설정한다. 이후 `main` 푸시가 정적 사이트를 자동 배포한다.

프로덕션은 <https://button-iota-one.vercel.app>에서 확인할 수 있다.
