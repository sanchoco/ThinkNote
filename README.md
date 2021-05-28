# 생각 낙서 (Back-end)

![KakaoTalk_20210527_195939625](https://user-images.githubusercontent.com/79817676/119823508-e1f17d00-bf2f-11eb-89a1-51a08bc4906f.png)

<!-- ![20210527_182435](https://user-images.githubusercontent.com/79817676/119802018-27568000-bf19-11eb-8b24-3190a67fceea.png) -->
<!--
![20210527_182525](https://user-images.githubusercontent.com/79817676/119802007-232a6280-bf19-11eb-970a-fb25c63940f3.png)
-->

<!--
## 목차
1. [생각낙서 소개](#생각낙서-소개)
2. [개요](#개요)
3. [개발환경](#기능정보)
4. [기능정보](#기능정보)
5. [DB 설계](#DB-설계)
6. [API 설계](#API-설계)
7. [힘들었던 점 및 개선](#힘들었던-점-및-개선)
8. [상세 설명 페이지](#상세-설명-페이지)
9. [Frond-End(React) 코드](#front-endreact-코드)
-->
## 🔦 웹 사이트
- [https://thinknote.us](https://thinknote.us)

## 💡 생각낙서 소개

- 친구들은 어떤 생각을 하고 있는지 궁금하지 않나요?
- 매일 3개씩, 재미있는 질문에 생각을 남기면 편하게 책장에 채워드려요. 😀 
- 구글, 네이버, 카카오 로그인으로 간편하게!
- 간편하게 생각을 공유해보세요. ^_^ 🌈

## 🔍 Target
- 매번 비슷한 내용의 일기보다 의미있는 생각을 적고 싶은 10대, 20대
- 자신의 생각을 간편하게 정리하여 보고 싶은 사람
- 친구, 애인 등 주변의 생각을 알아가고 더욱 관계가 깊어지고 싶을 때

## 📌 개요 
- 이름: 생각낙서
- 기간: 2021.04.25 ~ 2021.05.28
- 팀원
  - Front-end(React): 조형석, 이대호, 임다빈
  - Back-end(Node.js): 강태진, 조상균, 이총명
  - Designer(UI/UX): 성지원

## 🔌 개발 환경
- Server: AWS EC2(Ubuntu 20.04 LTS)
- Framework: Express(Node.js)
- Database: MongoDB
- Load Balancer: Nginx
- ETC: AWS S3

## ✨ 주요 기능
#### 1. 소셜 로그인
- 구글, 네이버, 카카오 계정을 활용한 소셜 로그인 방식 적용
#### 2. 오늘의 낙서 - 매일 질문 3개받고 쓰기 
- 사이트 질문 혹은 팔로잉한 친구가 만든 질문을 받아 볼 수 있습니다. 
- 최근 2주내에 답변한 질문은 보여지지 않습니다. 
- 답변은 1000자 이내로 작성 할 수 있으며, 전체공개 또는 비공개로 설정할 수 있습니다.
#### 3. 책장 페이지
- 오늘의 낙서에서 남긴 일자별로 답변을 모아 볼 수 있습니다. 
- 하루에 한 개씩 나만의 질문을 작성하여, 나를 팔로우 하는 친구들이 그 질문에 대해 답변할 수 있습니다.
- 나의 책장에서는 닉네임과 프로필 사진, 자기소개, 선호하는 태그를 수정할 수 있으며, 사진을 업로드시 자동으로 가로 400px 자동으로 리사이징 됩니다.  (multer-s3-transform, sharp 라이브러리 사용)
- 책장 페이지에서 팔로우를 신청 할 수 있으며, 팔로잉 팔로워를 조회할 수 있습니다.
#### 4. 답변 상세 확인
- 마음에 드는 답변에 좋아요를 남길 수 있으며, 좋아요 누른 사람들의 목록을 조회할 수 있습니다. 
- 댓글은 100자 이내로 작성 할 수 있으며, '@'를 사용하여 다른 사용자를 태그 할 수 있습니다. 
- 댓글에도 좋아요를 남길 수 있습니다.
- 자기가 쓴 답변은 수정 및 삭제를 할 수 있습니다.
#### 5. 유저 검색 
- 검색 기능으로 사용자를 찾을 수 있습니다
- 닉네임 일부분만 입력해도 해당하는 글자가 들어간 유저가 결과에 표시됩니다. 
- 최근 검색한 유저는 최대 5개까지 검색 리스트에 표시됩니다.
#### 6. 실시간 알림
- 누군가 자신이 쓴 글에 댓글이나 좋아요를 남기면 알림을 통해 확인할 수 있습니다.  
- 누군가 자신을 언급하거나 팔로잉 하면 알림을 통해 확인 할 수 있습니다.
#### 7. 크롬 익스텐션
- 크롬 웹스토어에서 '생각 낙서' 확장 프로그램을 다운 받을 수 있습니다.
- 다른 사람들이 어떤 생각을 하는지 간편하게 볼 수 있습니다.


## DB 설계 
![image](https://user-images.githubusercontent.com/79817676/119849209-68658900-bf47-11eb-9e88-832a99e86322.png)


## API 설계
- https://www.notion.so/API-1c038a55a290414596167012c37fb277


## 힘들었던 점 및 개선
1. 인앱링크 탈출 (ftp 서버) <br>
- 인앱 브라우저에서는 구글 및 소셜 로그인이 잘 안되는 경우가 있었습니다. 또한 프로필 사진 변경 간 사진 업로드가 안되는 경우도 있었습니다.  그래서 안드로이드 같은 경우, 주소에 intent와 app 패키지 이름을 통해 인앱을 빠져나갈 수 있었고 아이폰 같은 경우 주소의 시작이 ftp:// 인 경우, 기본 브라우저로 열리게 되는데, 그때문에 ftp 서버를 추가할 필요가 있었습니다.  ftp 서버에 프론트쪽 주소로 리다이렉션 하는 파일을 만들어 인앱임을 감지하면, ftp:// 로 인앱을 빠져나오고 기본 브라우저가 리다이렉션하는 파일을 불러와 원래주소로 리다이렉션 하게 만들었습니다.

2. 서버
- nginx
  - 부하가 걸릴경우를 대비하여 nginx를 load Balancer로 사용하였습니다. nginx의 proxy기능을 통해 외부에서 들어오는 요청을 내부의 서버 IP로 돌리도록 하였습니다. 
3. 보안
- ssl
- https
- jwt
  
4. 소켓통신

5. MongoDb 쿼리문

6. 성능개선
- Promise.all
- cron tab
- S3 (multer-s3-transform, sharp)

7. 정규표현식

## 상세 설명 페이지
- https://www.notion.so/e70b704cf035444b805dd95942f6e8ce?v=5f571d40bfa84721a648aab6808d234f

## Front-End(React) 코드 
- https://github.com/DabinLim/mind_bookshelf
