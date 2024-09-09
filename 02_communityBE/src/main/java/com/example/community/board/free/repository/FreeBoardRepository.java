package com.example.community.board.free.repository;

import com.example.community.board.free.model.FreeBoard;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FreeBoardRepository extends JpaRepository<FreeBoard, Long> {
    Page<FreeBoard> findAll(Pageable pageable);  // 페이징과 정렬을 위한 메서드 추가
}
