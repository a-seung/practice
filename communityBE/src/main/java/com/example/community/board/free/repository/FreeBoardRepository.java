package com.example.community.board.free.repository;

import com.example.community.board.free.model.FreeBoard;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FreeBoardRepository extends JpaRepository<FreeBoard, Long> {
}
