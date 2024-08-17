package com.example.community.board.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "boards")  // boards 테이블과 매핑
@Getter
@Setter
@NoArgsConstructor
public class Board {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // 게시판 번호

    private String name;  // 게시판 이름

    private String description;  // 게시판 설명

    public Board(Long id) {
        this.id = id;
    }
}

