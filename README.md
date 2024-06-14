# 리얼타임 게임 프로젝트 (dino game)

### 내일배움 캠프 5기 Node.js 게임서버트랙 개인 과제

---

### [패킷 구조](https://industrious-lasagna-717.notion.site/Node-js-5339a427260443d0a865e3d6f88b47ca?pvs=4)

---

### 기술 스택
[![JavaScript Badge](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![express](https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white)
![redis](https://img.shields.io/badge/redis-FF4438?style=for-the-badge&logo=redis&logoColor=white)

---

**📄게임 장르**

  - 사이드뷰, 점핑 액션 게임

**⚽게임 컨텐츠**

- 스테이지 진행

  - 시간에 따른 점수 획득
    - 기본적으로 오른쪽을 이동하면서 장애물을 피하는 게임
    - 오래 버틸수록 높은 점수 획득 (시간에 따른)
  - 스테이지에 따라서 더 높은 점수 획득
    - 0점 , 1스테이지
    - 10점, 2스테이지
    - 위와 같이 점수로 나뉘어서 스테이지 구분
    - 스테이지가 올라갈수록 시간당 높은 점수 획득 가능

 - 아이템 획득

   - 아이템 종류에 따라 다른 점수 획득
     - 이동 중 아이템 무작위 생성
   - 스테이지에 따라 생성되는 아이템 구분
     - 1스테이지에는 1번 아이템만, 2스테이지에는 2번 아이템까지 나오는 것
     - 높은 스테이지의 아이템에서는 더 높은 점수 획득 가능
