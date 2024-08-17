package com.example.community.files.model;

import com.example.community.board.model.Board;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "files")
public class Files {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // 파일 ID

    @ManyToOne
    @JoinColumn(name = "board_id", nullable = false)  // 게시판 ID
    private Board board;

    @Column(name = "post_id", nullable = false)  // 게시글 ID
    private Long postId;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "file_path", nullable = false)
    private String filePath;

    @Column(name = "upload_time")
    private LocalDateTime uploadTime = LocalDateTime.now();

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "content_type")
    private String contentType;
}
