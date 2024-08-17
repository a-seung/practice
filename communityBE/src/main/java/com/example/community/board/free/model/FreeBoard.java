package com.example.community.board.free.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Entity
@Table(name = "free_board")  // 테이블 이름은 게시판별로 달라짐
@Getter
@Setter
@NoArgsConstructor // 기본 생성자를 Lombok이 자동으로 생성
@ToString
public class FreeBoard {  // 공통된 이름으로 Article 사용

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // 게시글 번호

    private String title;  // 게시글 제목

    @Column(columnDefinition = "TEXT")
    private String content;  // 게시글 내용

    private Long writerId;  // 작성자의 ID

    private String filePath;  // 파일 경로 필드 추가

    private LocalDateTime createdAt = LocalDateTime.now();  // 작성 시간

    private LocalDateTime updatedAt = LocalDateTime.now();  // 수정 시간

    private int viewCount = 0;  // 조회수

    private int likeCount = 0;  // 좋아요 수

    private int commentCount = 0;  // 댓글 수

}

