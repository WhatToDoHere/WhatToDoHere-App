# 📍 WhatToDoHere

<p align="center">
  <img width="600" alt="WhatToDoHere_cover" src="https://github.com/user-attachments/assets/f793016e-ce86-4c64-880d-f69b9400b82d">
</p>

<div align="center">
WhatToDoHere는 <b>위치 기반 미리 알림</b>을 제공하는 React Native 모바일 애플리케이션입니다. <br>
사용자의 GPS와 WiFi 정보를 활용하여 특정 위치에 등록된 할 일을 알려주며, <br>
친구와의 할 일 공유 기능을 통해 협업을 지원합니다.
</div>

<br>

## 🔗 Links

<div align="center">
 <a href="#-links">WhatToDoHere iOS</a> | <a href="#-links">WhatToDoHere TestFlight</a> | <a href="https://github.com/moonstrnck/WhatToDoHere">WhatToDoHere Repository</a>
</div>

<br>

## 🗂️ Index

- [**📍 WhatToDoHere**](#-whattodohere)
- [**🔗 Links**](#-links)
- [**🧐 Motivation**](#-motivation)
- [**🔧 Tech Stack**](#-tech-stack)
- [**📱 Features**](#-features)
- [**🚨 Challenges**](#-challenges)
- [**💭 Reflections**](#-reflections)

<br>

## 🧐 Motivation

우리에겐 매 순간 크고 작은 할 일들이 생겨납니다. 타임라인 순으로 처리할 일도 있지만, 특정 위치에서만 할 수 있는 일들이 있습니다. 예를 들어, 세탁기 예약 설정과 같이 집에서만 할 수 있는 일, 또는 회사에서 해야 할 업무처럼요.<br>
시중에는 수많은 작업 관리 툴들이 많지만 오히려 너무 많은 옵션과 기능을 제공해 간편한 작업들을 등록하기에 부담스러운 경우가 많습니다. 그래서 저는 보다 직관적으로 위치 별 할 일을 등록하여 해당 위치에 도착했을 때 알려주는 어플리케이션이 있으면 일상의 편리함을 줄 수 있지 않을까? 라는 아이디어에서 WhatToDoHere를 기획하게 되었습니다.

<br>

## 🔧 Tech Stack

### Client

![Javascript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![Jotai](https://img.shields.io/badge/Jotai-white.svg?logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyLjllbSIgaGVpZ2h0PSIxZW0iIHZpZXdCb3g9IjAgMCA1MTIgMTc3Ij48cGF0aCBkPSJNNzQuOTk3IDkuNDA1aDM0LjQ1M3YxMTQuOTJhNTIuMTYgNTIuMTYgMCAwIDEtNy4wODIgMjcuNjM3YTQ4LjE0IDQ4LjE0IDAgMCAxLTE5Ljc5NCAxOC4xMTJhNjQuMiA2NC4yIDAgMCAxLTI5LjM3MiA2LjM5MmE2Ni41IDY2LjUgMCAwIDEtMjctNS4zMTJhNDMgNDMgMCAwIDEtMTkuMTItMTYuMDkzUTAgMTQ0LjI3OSAwIDEyNy44NjZoMzQuNjgzYy4xMDcgNi41MzMgMiAxMS42MzIgNS42ODMgMTUuMjQ0YTE5Ljg1IDE5Ljg1IDAgMCAwIDE0LjYwNyA1LjQzNXExOS44NjQgMCAyMC4wMjQtMjQuMjJ6bTExMC45MDEgMTY3LjIycS0xOC43NSAwLTMyLjM4MS04LjAwM2E1NC4wNyA1NC4wNyAwIDAgMS0yMS4wNTEtMjIuMzc4YTcxLjc0IDcxLjc0IDAgMCAxLTcuNC0zMy4zNTZhNzIuMTUgNzIuMTUgMCAwIDEgNy40LTMzLjUxNWE1NC4yIDU0LjIgMCAwIDEgMjEuMDUtMjIuMzc4YTYyLjkgNjIuOSAwIDAgMSAzMi4zODItOC4wMDNhNjMgNjMgMCAwIDEgMzIuNCA4LjAwM2E1NC4xIDU0LjEgMCAwIDEgMjEuMDMzIDIyLjM3OGE3Mi4xNiA3Mi4xNiAwIDAgMSA3LjQxOCAzMy41MTVhNzEuNzQgNzEuNzQgMCAwIDEtNy40MTggMzMuMzU2YTU0IDU0IDAgMCAxLTIxLjAzMyAyMi4zNzhxLTEzLjY1IDguMDItMzIuNCA4LjAwM20zOS4xOTgtMTY3LjIydjE4LjU5aC03OC4zNzhWOS40MDV6bS0zOC45NSAxNDAuNjYzYTIxLjI1IDIxLjI1IDAgMCAwIDE4Ljk4NS0xMC4xMjZsLjI5Ni0uNDk3cTYuNTUtMTAuNjIyIDYuNTUtMjYuNzg3cTAtMTUuNjI1LTYuMTctMjYuMTIybC0uNDM0LS43MThhMjEuMjUgMjEuMjUgMCAwIDAtMTkuMjgtMTAuNjIzYTIxLjUxIDIxLjUxIDAgMCAwLTE5LjE4MiAxMC4xMzdsLS4yOTMuNDg2cS02LjYwNCAxMC42MjMtNi42MDQgMjYuODRxMCAxNS42NzYgNi4xNzEgMjYuMDc2bC40MzMuNzExYTIxLjUzIDIxLjUzIDAgMCAwIDE4Ljg2IDEwLjYzOXptMTQzLjY5LTk5LjQ2NHYyNS43NmgtMjMuMjYzdjU5Ljk0N3EwIDcuMDgzIDMuMjIyIDkuNTYxYTEzLjI4IDEzLjI4IDAgMCAwIDcuODE0IDIuNTFsLjU2LS4wMTRhMjYgMjYgMCAwIDAgNC44MTYtLjQ0MmwzLjctLjY3M2w1LjMxMiAyNS41MTJsLTEuMzIyLjM4NWMtMS41NzYuNDQ0LTMuNTIzLjk0Ny01LjkyIDEuNDkyYTYwLjQgNjAuNCAwIDAgMS0xMC4wNzcgMS4yODdsLTEuMjcxLjA0cS0xOC42NzkuODMzLTI5Ljk3NC04LjA3MnEtMTEuMDQtOC43MDQtMTEuMTM4LTI2LjMzNGwuMDAyLTY1LjJoLTE2LjkwOHYtMjUuNzZoMTYuOTA4di0yOS42MmgzNC4yNzZ2MjkuNjJ6bTUyLjU4MyAxMjUuOTVxLTE3LjcwNCAwLTI5LjM3Mi05LjI2dC0xMS42NjctMjcuNnEwLTEzLjgyOSA2LjUxNS0yMS43MjRhMzcuNSAzNy41IDAgMCAxIDE3LjEwMy0xMS41NjJhOTcgOTcgMCAwIDEgMjIuNzMzLTQuNzhhMTc0LjUgMTc0LjUgMCAwIDAgMjMuMDE2LTMuMzgxcTYuOTQtMS43NyA2LjkyMi03Ljcydi0uNDk1Yy4yNi00LjQ2LTEuNDk1LTguOC00Ljc4LTExLjgyN3EtNC44MTUtNC4xNi0xMy41NjItNC4xNzhhMjQuMzggMjQuMzggMCAwIDAtMTQuNzMgNC4wMTlhMTguOTQgMTguOTQgMCAwIDAtNy4yNDEgMTAuMjE1bC0zMS43MDktMi41NjdhNDIuMjggNDIuMjggMCAwIDEgMTcuNTgtMjYuODA1cTE0LjA1OC05Ljg3OSAzNi4yNi05Ljg5N2E3NC44IDc0LjggMCAwIDEgMjUuNzQyIDQuMzU2YTQyLjgzIDQyLjgzIDAgMCAxIDE5LjM2OSAxMy41NjFxNy4zNjUgOS4yMjUgNy4zNjUgMjMuOTM3djgzLjM3MWgtMzIuNTA2di0xNy4xMzhoLS45NTZhMzUuNzMgMzUuNzMgMCAwIDEtMTMuNDkgMTQuMDRxLTguOTc3IDUuNDM1LTIyLjU5MiA1LjQzNW05LjgwOS0yMy42NzFhMjYuNTYgMjYuNTYgMCAwIDAgMTguNTE5LTYuNTVhMjEuMTQgMjEuMTQgMCAwIDAgNy4yNDItMTUuNjY3bC0uMDAxLTEzLjc0MWEyMC4yIDIwLjIgMCAwIDEtNi4yMzIgMi40MDhhMTAxIDEwMSAwIDAgMS05LjAzIDEuNzdsLTMuMDgzLjQ3NGMtMS45NzYuMzExLTMuNzk4LjYwNi01LjQ4NS44NTRhMzQgMzQgMCAwIDAtMTQuNTE4IDUuMDgxYTEyLjUgMTIuNSAwIDAgMC01LjUwNiAxMS4wMTNhMTIuMjkgMTIuMjkgMCAwIDAgNS4wOTkgMTAuNjIyYTIyIDIyIDAgMCAwIDEyLjI1MyAzLjc0NnptMTAxLjc5LTExOC4yMTJsLS42MDgtLjAwMmExOC40MyAxOC40MyAwIDAgMS0xMy4wNDktNS4xMTZhMTYuMTggMTYuMTggMCAwIDEtNS40Ny0xMi4yN2ExNi4xIDE2LjEgMCAwIDEgNS40Ny0xMi4yMzNjNy40MjQtNi43MzMgMTguNzQ0LTYuNzMzIDI2LjE2OCAwYTE2LjEgMTYuMSAwIDAgMSA1LjQ3IDEyLjIzM2ExNi4xOCAxNi4xOCAwIDAgMS01LjA1NiAxMS44OWwtLjQxNC4zOGExOC41IDE4LjUgMCAwIDEtMTIuNTEgNS4xMThtLTE3Ljc2NCAxMzkuNTQ2VjUwLjYwNGgzNC4yNzZ2MTIzLjYxM3oiLz48L3N2Zz4=&style=for-the-badge&logoColor=black)

### Server

![NODE.JS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

### Test

![Jest Expo](https://img.shields.io/badge/Jest_Expo-99424F?style=for-the-badge&logo=jest&logoColor=white)

### Deployment

![App Store](https://img.shields.io/badge/App_Store-0D96F6?style=for-the-badge&logo=app-store&logoColor=white)
![TestFlight](https://img.shields.io/badge/TestFlight-0D96F6?style=for-the-badge&logo=testflight&logoColor=white)
![EAS](https://img.shields.io/badge/EAS-000020?style=for-the-badge&logo=expo&logoColor=white)

### Development Tools

![Xcode](https://img.shields.io/badge/Xcode-147EFB?style=for-the-badge&logo=xcode&logoColor=white)

### ✔️ 네이티브 모듈을 사용함에도 왜 Expo였나?

---

Expo는 React Native 개발을 단순화하는 프레임워크입니다. 이는 복잡한 네이티브 환경 설정 없이 iOS와 Android 앱을 개발할 수 있게 해줍니다. Expo SDK는 이 프레임워크의 핵심 구성 요소로, 다양한 네이티브 기능을 JavaScript API로 제공합니다. 이를 통해 개발자는 네이티브 코드를 직접 작성하지 않고도 많은 기능을 구현할 수 있습니다. <br><br>
이러한 이유로 초기 계획부터 Expo를 활용한 React Native 개발을 진행하려고 했습니다. 또한 위치 추적(expo-location)과 알림 기능(expo-notifications)은 위치 기반 할 일 알림이라는 WhatToDoHere 앱의 핵심 기능 구현에 필수적이었습니다. 이를 Expo SDK가 지원해주기에 Expo를 통해 구현해야겠다는 생각이었습니다. <br><br>
그러나 프로젝트 진행 중 Expo SDK가 지원하는 모듈 이외의 네이티브 모듈 또한 필요한 상황이라는 것을 얼마 지나지 않아 깨닫게 되었습니다. WhatToDoHere에서는 정밀한 지도 기능을 위한 `react-native-maps`와 WiFi 네트워크 정보 확인을 위한 `@react-native-community/netinfo`가 필요했습니다. Expo SDK에서 지원하지 않는다는 모듈임을 확인한 후에는 Expo를 포기해야한다는 생각에 절망적이었습니다.<br><br>
하지만 결론적으로 이 문제는 EAS(Expo Application Services) Prebuild를 통해 해결할 수 있었습니다. EAS Prebuild 도입 이전에는 네이티브 모듈을 사용하기 위해 `expo eject` 명령을 사용해야 했습니다. Expo 환경에서 벗어나 순수 React Native 프로젝트를 전환하는 것을 의미했고, 이는 Expo의 많은 이점을 포기해야 하는 단점이 있었죠. 하지만 EAS Prebuild는 Expo의 편의성을 유지하면서도 추가적인 네이티브 모듈을 사용할 수 있게 해주는 도구입니다. <br><br>
결과적으로, Expo와 EAS Prebuild의 조합은 WhatToDoHere 프로젝트에 적합했습니다. 위치 기반 서비스, 알림 시스템, 지도 통합, 네트워크 상태 관리 등의 복잡한 기능을 효율적으로 구현할 수 있었고, 동시에 필요한 모든 네이티브 기능도 사용할 수 있었습니다. 이로 인해 개발 시간이 단축되고 실제 기능 개발에 더욱 집중할 수 있었습니다.

### ✔️ 전역상태관리 도구로서 Jotai를 선택한 이유

---
짧은 개발 기간과 프로젝트 규모를 생각했을 떄, 상태관리 도구로서 Jotai를 선택했습니다. 가장 크게 고려했던 점은 작은 기능에도 잦은 화면 전환이 일어날 수 있는 모바일 앱 특성상, 다양한 화면 또는 컴포넌트에서 전역상태에 쉽게 접근이 가능했어야 했습니다. Jotai는 이런 상황에서 매우 적합했습니다. Jotai는 atom이라는 작은 단위로 상태를 관리합니다. <br> 이 atom들은 필요한 컴포넌트에서 쉽게 임포트하여 사용할 수 있습니다. 이는 중앙 집중식 store를 사용하는 다른 상태 관리 라이브러리와는 달리 전역 상태에 쉽게 접근하고 업데이트 할 수 있는 환경을 제공합니다. <br>
또한 Jotai는 atom 단위로 상태가 업데이트되므로 불필요한 리렌더링을 줄일 수 있었습니다.<br><br>
다양한 상태관리 도구와 비교했을 때에도 Jotai의 Atomic 접근 방식이 더욱 세분화되고 유연한 방식으로 상태를 업데이트할 수 있다는 점에서 가장 매력적으로 다가왔기 때문에 Jotai를 상태관리 도구로서 선택하게 되었습니다. 다음은 다른 전역상태관리 도구와 Jotai를 비교한 표입니다.

<table style="border-collapse: collapse; width: 100%;">
  <thead>
    <tr style="background-color: #eee;">
      <th style="border: 1px solid #ddd; text-align: left;">라이브러리</th>
      <th style="border: 1px solid #ddd; text-align: left;">장점</th>
      <th style="border: 1px solid #ddd; text-align: left;">단점</th>
      <th style="border: 1px solid #ddd; text-align: left;">WhatToDoHere와의 관계</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #ddd;">Redux</td>
      <td style="border: 1px solid #ddd;">
        • 강력하고 예측 가능한 상태 관리<br>
        • 큰 생태계
      </td>
      <td style="border: 1px solid #ddd;">
        • 복잡한 설정<br>
        • 많은 보일러플레이트 코드 필요
      </td>
      <td style="border: 1px solid #ddd;">프로젝트의 규모가 Redux의 복잡성을 정당화할 만큼 크지 않음</td>
    </tr>
    <tr>
      <td style="border: 1px solid #ddd;">MobX</td>
      <td style="border: 1px solid #ddd;">
        • 반응형 프로그래밍 모델<br>
        • 강력한 성능
      </td>
      <td style="border: 1px solid #ddd;">
        • 학습 곡선이 가파름<br>
        • 내부 동작이 복잡하여 디버깅이 어려울 수 있음
      </td>
      <td style="border: 1px solid #ddd;">앱의 상태 모델이 MobX의 복잡성을 필요로 하지 않음</td>
    </tr>
    <tr>
      <td style="border: 1px solid #ddd;">Recoil</td>
      <td style="border: 1px solid #ddd;">
        • React에 특화<br>
        • 강력한 비동기 지원
      </td>
      <td style="border: 1px solid #ddd;">
        • 업데이트 주기가 불규칙적<br>
        • 커뮤니티 활성도가 상대적으로 낮음
      </td>
      <td style="border: 1px solid #ddd;">기능은 유사하지만, Jotai에 비해 안정성과 커뮤니티 지원이 부족</td>
    </tr>
    <tr>
      <td style="border: 1px solid #ddd;">Zustand</td>
      <td style="border: 1px solid #ddd;">
        • 간단한 API<br>
        • 작은 번들 사이즈
      </td>
      <td style="border: 1px solid #ddd;">• Redux와 유사한 패턴을 따르므로 약간의 보일러플레이트 필요</td>
      <td style="border: 1px solid #ddd;">Jotai보다 약간 더 복잡하고, React에 덜 특화됨</td>
    </tr>
    <tr>
      <td style="border: 1px solid #ddd;">Jotai</td>
      <td style="border: 1px solid #ddd;">
        • 매우 간단한 API<br>
        • React Hooks와의 완벽한 통합<br>
        • 필요한 컴포넌트만 리렌더링<br>
        • 작은 번들 사이즈
      </td>
      <td style="border: 1px solid #ddd;">• 복잡한 상태 로직에는 부족할 수 있음</td>
      <td style="border: 1px solid #ddd;">
        • 간단한 API로 빠른 개발 가능<br>
        • 작은 번들 사이즈로 모바일 앱 성능 최적화<br>
        • React Native와의 호환성이 뛰어남<br>
        • Firebase와의 비동기 작업 처리에 적합
      </td>
    </tr>
  </tbody>
</table>
<br>

## 📱 Features

### 1. 구글 로그인 및 로그아웃

<div style="text-align: center">
  <img width="200" alt="" src="https://github.com/user-attachments/assets/ce4bacb9-5c2c-42d4-bcdf-22a1afaeff72">
</div>
<br>

- 간편한 로그인을 위한 구글 연동 로그인 및 로그아웃
  - 친구와의 할 일 공유 기능을 위해서는 로그인 정보 필수
  - Guest 모드 (기능 보완 예정, 로그인하지 않아도 친구 공유 기능 이외에 사용이 가능해야함)

### 2. 위치 및 할 일 관리

<div style="text-align: center">
  <img width="200" alt="" src="https://github.com/user-attachments/assets/ce4bacb9-5c2c-42d4-bcdf-22a1afaeff72">
</div>
<br>

- 현재 위치 또는 위치 검색을 통한 새로운 위치 등록
- (현재 위치의 경우) WiFi SSID 및 BSSID 정보 자동 등록
- 위치별 공개/비공개 설정
- 할 일 제목, 메모, 이미지 등록 기능
- 할 일별 알림 여부, 도착할 때/떠날 때 옵션 설정, 지연 알림 시간 설정
- 사용자가 등록한 위치에 도착하거나 떠날 때 알림 제공

### 3. 친구와의 할 일 공유

<div style="text-align: center">
  <img width="200" alt="" src="https://github.com/user-attachments/assets/ce4bacb9-5c2c-42d4-bcdf-22a1afaeff72">
</div>
<br>

- 이메일을 통한 친구 검색 및 등록
- 친구의 공개 위치 확인 및 할 일 요청 기능

### 4. 사용자 경험

<div align="center" style="text-align: center">
  <img width="200" alt="" src="https://github.com/user-attachments/assets/ce4bacb9-5c2c-42d4-bcdf-22a1afaeff72">
</div>
<br>

- 완료한 할 일 목록 제공
- 직관적인 사용자 인터페이스
  - 위치별 할 일 목록 표시 및 위치 카드의 아코디언 UI
  - Native-like interactions

<br>

## 🚨 Challenges

[챌린지 작성 예정]

<!-- 1. React Native에서의 백그라운드 위치 추적 구현
2. WiFi 정보를 이용한 정확한 실내 위치 파악
3. Firebase를 활용한 실시간 데이터 동기화
4. 친구 간 할 일 공유 시 데이터 보안 및 프라이버시 보호 -->

<br>

## 💭 Reflections

[회고 작성 예정]
