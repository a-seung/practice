package com.example.community.board.free.controller;

import com.example.community.board.free.dto.FreeBoardRequestDTO;
import com.example.community.board.free.service.FreeBoardService;
import com.example.community.board.free.model.FreeBoard;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@Slf4j
@RequiredArgsConstructor  // Lombok을 사용해 생성자 자동 생성
@RequestMapping("/free-board")  // 자유게시판의 엔드포인트
public class FreeBoardController {

    private final FreeBoardService freeBoardService;

    // 모든 게시글 조회 (페이징 및 정렬)
    @GetMapping
    public Page<FreeBoard> getAllFreeArticles(
            @RequestParam(defaultValue = "0") int page,       // 기본 페이지는 0
            @RequestParam(defaultValue = "10") int size,      // 기본 페이지 크기는 10
            @RequestParam(defaultValue = "id") String sortBy, // 정렬 기준은 id
            @RequestParam(defaultValue = "desc") String order  // 기본 정렬 방식은 내림차순
    ) {
        Sort.Direction direction = order.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        Page<FreeBoard> articles = freeBoardService.getAllArticles(pageable);
        log.info("==============> 게시글 조회 성공 : 페이지 = {}, 크기 = {}, 정렬 = {} {}", page, size, sortBy, order);
        return articles;
    }

    // 특정 게시글 조회
    @GetMapping("/{id}")
    public ResponseEntity<FreeBoard> getFreeArticleById(@PathVariable Long id) {
        Optional<FreeBoard> articleOpt = freeBoardService.getArticleById(id);

        if (articleOpt.isPresent()) {
            FreeBoard article = articleOpt.get();  // article에서 FreeBoard 객체를 꺼내서 사용

            // 조회수 증가
            article.setViewCount(article.getViewCount() + 1);
            freeBoardService.updateArticle(id, article);  // 변경된 조회수를 저장

            log.info("==============> 특정 게시글 조회 성공: {}", article);
            return ResponseEntity.ok(article);
        } else {
            log.info("==============> 게시글을 찾을 수 없음, ID: {}", id);
            return ResponseEntity.notFound().build();
        }
    }

    // 게시글 작성
    @PostMapping
    public ResponseEntity<FreeBoard> createFreeArticleWithFile(
            @Valid @RequestBody FreeBoardRequestDTO articleDTO
    ) {
        // 게시글 정보 처리
        FreeBoard article = new FreeBoard();
        article.setTitle(articleDTO.getTitle());
        article.setContent(articleDTO.getContent());
        article.setWriterId(articleDTO.getWriterId());

        FreeBoard createdArticle = freeBoardService.createArticle(article);
        log.info("==============> 게시글 및 파일 생성 성공 : {}", createdArticle);

        return ResponseEntity.ok(createdArticle);
    }

    // 게시글 수정 (DTO 활용 및 입력값 검증)
    @PutMapping("/{id}")
    public ResponseEntity<FreeBoard> updateFreeArticle(@PathVariable Long id, @Valid @RequestBody FreeBoardRequestDTO articleDTO) {
        FreeBoard article = new FreeBoard();
        article.setId(id);
        article.setTitle(articleDTO.getTitle());
        article.setContent(articleDTO.getContent());

        FreeBoard updatedArticle = freeBoardService.updateArticle(id, article);
        log.info("==============> 게시글 수정 완료 : {}", updatedArticle);

        return ResponseEntity.ok(updatedArticle);
    }

    // 게시글 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFreeArticle(@PathVariable Long id) {
        log.info("=============> 게시글 삭제 요청: ID = {}", id);

        // 삭제할 게시글이 있는지 확인
        Optional<FreeBoard> articleOpt = freeBoardService.getArticleById(id);
        if (articleOpt.isEmpty()) {
            log.warn("=============> 게시글 삭제 실패: ID = {}는 존재하지 않습니다.", id);
            return ResponseEntity.status(404).body("게시글 삭제 실패 - 해당 ID가 존재하지 않습니다.");
        }

        // 게시글이 있으면 삭제
        freeBoardService.deleteArticle(id);
        log.info("=============> 게시글 삭제 성공: ID = {}", id);

        return ResponseEntity.ok("게시글 삭제 성공!");
    }
}
