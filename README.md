# blabla

<img src="https://blabla-cloud.s3.ap-northeast-2.amazonaws.com/public/default-chat-image.png" alt="chat_log" width="250" />

**실시간 채팅 애플리케이션**

사용자 간의 실시간 메시지 송수신이 가능한 단순한 채팅 기능을 제공합니다.

> 개발 기간: 2025년 03월 14일 ~ 2025년 03월 28일 (총 기간 : 2주)

> 배포 링크: 👉 [blabla 바로가기](http://blabla-client.s3-website.ap-northeast-2.amazonaws.com/)

<br>

### 프로젝트 목표

- 서버는 Docker를 이용한 EC2 배포
- 클라이언트는 SPA 기반 클라이언트 + S3 정적 배포
- CI/CD 파이프라인 설정 GitHub Actions을 활용하여 코드 변경이 있을 때마다 자동으로 테스트, 빌드, 배포를 진행하며 CI를 적극 활용할 예정
- 웹소켓을 활용한 실시간 채팅 간단한 채팅 애플리케이션을 만들어 실시간으로 메시지를 주고받을 수 있도록 웹소켓 사용

<br>

## 기술 스택

### 주요 환경

| Language   | Framework              | CI/CD          | Container | Database           | Realtime  | Storage (Files / Deploy)      | Deployment                   |
| ---------- | ---------------------- | -------------- | --------- | ------------------ | --------- | ----------------------------- | ---------------------------- |
| TypeScript | Nest.js / React + Vite | GitHub Actions | Docker    | PostgreSQL / Redis | WebSocket | AWS S3 (images, client build) | AWS EC2 (server & WebSocket) |

### 주요 라이브러리

| Category | Libraries                                                                                                         |
| -------- | ----------------------------------------------------------------------------------------------------------------- |
| Backend  | `@nestjs/testing` `k6` `@nestjs/typeorm` `class-validator` `@nestjs/jwt` `@nestjs/websockets` `ioredis` `aws-sdk` |
| Frontend | `@tanstack/react-query` `axios` `socket.io-client` `tailwindcss` `date-fns` `js-cookie` `react-router-dom`        |

<br>

## 팀원 및 역할

| 이름   | 역할            |
| ------ | --------------- |
| 정수종 | Full-stack 개발 |

<br>

## 프로젝트 상세

### 로그인 및 회원가입 페이지

<div style="display: flex; gap: 1rem; justify-content: center;">
  <img src="https://blabla-cloud.s3.ap-northeast-2.amazonaws.com/public/pages/signin.png" alt="signin" style="width: 49%;" />
  <img src="https://blabla-cloud.s3.ap-northeast-2.amazonaws.com/public/pages/signup.png" alt="signup" style="width: 49%;" />
</div>

### 채팅 페이지

<details>
  <summary>상세 설명</summary>

- 사용자가 참여 중인 1:1 채팅 목록을 조회
- 상대방의 이름을 선택해 새로운 채팅방을 생성
- 채팅방은 수신자에게 첫 메시지를 보낸 시점에 생성
- 탈퇴한 회원의 경우 채팅방 내에서 "알수없음"으로 표시

</details>

![chat](https://blabla-cloud.s3.ap-northeast-2.amazonaws.com/public/pages/chat.png)

### 채팅 생성 모달

<details>
  <summary>상세 설명</summary>

- 친구 목록에서 채팅 상대를 선택
- 선택한 친구와 이미 채팅 중인 경우, 해당 채팅방으로 이동
- 새 친구 선택 후 채팅 시, 새로운 채팅방이 생성됩니다.

</details>

![create_chat](https://blabla-cloud.s3.ap-northeast-2.amazonaws.com/public/pages/create_chat.png)

### 친구 목록 페이지 및 상세 조회 모달

![friendList_detail](https://blabla-cloud.s3.ap-northeast-2.amazonaws.com/public/pages/friendList_detail.png)

### 내 정보 수정

<details>
  <summary>상세 설명</summary>

- 사용자 이름 및 상태 메시지를 수정
- 회원 탈퇴 기능
- 프로필 이미지는 AWS S3에 저장, 기존 이미지는 자동으로 삭제

</details>

![edit_myInfo](https://blabla-cloud.s3.ap-northeast-2.amazonaws.com/public/pages/edit_myInfo.png)

<br>
<br>

> 그 외 다양한 기능은 배포된 링크를 통해 확인 👉 [blabla 바로가기](http://blabla-client.s3-website.ap-northeast-2.amazonaws.com/)

<br>

## 프로젝트 구성

### ERD (Entity Relationship Diagram)

> 효율적인 데이터베이스 설계와 명확한 도메인 정의를 위해 활용

![ERD](https://blabla-cloud.s3.ap-northeast-2.amazonaws.com/public/blabla_erd.png)

### 아키텍처 구성도

> 프론트엔드, 백엔드, 데이터베이스, 스토리지 등 주요 인프라 구성을 시각화

![아키텍처](https://blabla-cloud.s3.ap-northeast-2.amazonaws.com/public/blabla_architecture.png)
