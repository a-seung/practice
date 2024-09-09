create database ityl;

use ityl;

CREATE TABLE users (
                       id BIGINT AUTO_INCREMENT PRIMARY KEY,   -- 사용자 고유 ID
                       kakao_id BIGINT UNIQUE,                 -- 카카오 계정 고유 ID
                       username VARCHAR(100),                  -- 사용자명 (카카오에서 제공될 수 있는 값)
                       nickname VARCHAR(100),                  -- 사용자가 설정할 닉네임
                       email VARCHAR(255),                     -- 이메일 (카카오에서 제공)
                       role VARCHAR(50) DEFAULT 'USER',        -- 사용자 역할 (USER, ADMIN)
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- 가입일자
                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP  -- 마지막 업데이트 일자
);


select * from users;

CREATE TABLE free_board (
                            id BIGINT AUTO_INCREMENT PRIMARY KEY,   -- 게시글 고유 번호
                            title VARCHAR(255) NOT NULL,            -- 게시글 제목
                            content TEXT NOT NULL,                  -- 게시글 내용
                            writer_id BIGINT,                       -- 작성자의 사용자 ID (users 테이블 참조)
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- 작성 시간
                            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  -- 수정 시간
                            view_count INT DEFAULT 0,               -- 조회수
                            like_count INT DEFAULT 0,               -- 좋아요 수
                            comment_count INT DEFAULT 0,            -- 댓글 수
                            FOREIGN KEY (writer_id) REFERENCES users(id) ON DELETE SET NULL  -- 외래 키, 작성자 삭제 시 NULL로 처리
);

select * from free_board;

INSERT INTO users (kakao_id, username, nickname, email, role, created_at, updated_at)
VALUES
    (123456, '이승아', '닉네임1', 'user1@example.com', 'ADMIN', NOW(), NOW()),
    (234567, '이예지', '닉네임2', 'user2@example.com', 'USER', NOW(), NOW()),
    (345678, '권오현', '닉네임3', 'user3@example.com', 'USER', NOW(), NOW()),
    (456789, '임준수', '닉네임4', 'user4@example.com', 'ADMIN', NOW(), NOW()),
    (567890, '김서연', '닉네임5', 'user5@example.com', 'USER', NOW(), NOW());

SELECT * FROM users;


INSERT INTO free_board (title, content, writer_id, created_at, updated_at, view_count, like_count, comment_count)
VALUES
    ('게시글 제목1', '테스트 내용1입니다.', 1, NOW(), NOW(), 0, 0, 0),
    ('게시글 제목2', '테스트 내용2입니다.', 2, NOW(), NOW(), 0, 0, 0),
    ('게시글 제목3', '테스트 내용3입니다.', 3, NOW(), NOW(), 0, 0, 0),
    ('게시글 제목4', '테스트 내용4입니다.', 4, NOW(), NOW(), 0, 0, 0),
    ('게시글 제목5', '테스트 내용5입니다.', 5, NOW(), NOW(), 0, 0, 0);

SELECT * FROM free_board;


CREATE TABLE boards (
                        id BIGINT AUTO_INCREMENT PRIMARY KEY,
                        name VARCHAR(100) NOT NULL, -- 게시판 이름 (자유게시판, 공지사항, 익명게시판 등)
                        description VARCHAR(255),    -- 게시판 설명 (선택 사항)
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- 생성일
);

INSERT INTO boards (name, description)
VALUES
    ('자유게시판', '자유롭게 글을 쓸 수 있는 게시판입니다.'),
    ('공지사항', '중요한 공지사항을 올리는 게시판입니다.'),
    ('익명게시판', '익명으로 의견을 남길 수 있는 게시판입니다.');

select * from boards;

CREATE TABLE files (
                       id BIGINT AUTO_INCREMENT PRIMARY KEY,              -- 파일 ID
                       board_id BIGINT NOT NULL,                          -- 게시판 ID (외래키)
                       post_id BIGINT NOT NULL,                           -- 게시글 ID
                       file_name VARCHAR(255) NOT NULL,                   -- 실제 파일 이름
                       file_path VARCHAR(255) NOT NULL,                   -- 파일 저장 경로
                       upload_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,   -- 파일 업로드 시간
                       file_size BIGINT,                                  -- 파일 크기 (바이트)
                       content_type VARCHAR(100),                         -- 파일 MIME 타입 (이미지, PDF 등)
                       FOREIGN KEY (board_id) REFERENCES boards(id),      -- 게시판 테이블과의 외래키 설정
                       FOREIGN KEY (post_id) REFERENCES free_board(id)    -- 게시글 테이블과의 외래키 설정 (여기서는 자유게시판 테이블 사용)
);

select * from files;





