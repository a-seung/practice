package com.example.community.board.free.controller;

import com.example.community.board.free.dto.FreeBoardRequestDTO;
import com.example.community.board.free.service.FreeBoardService;
import com.example.community.board.free.model.FreeBoard;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@Slf4j
@RequiredArgsConstructor  // Lombok을 사용해 생성자 자동 생성
@RequestMapping("/free-board")  // 자유게시판의 엔드포인트
public class FreeBoardController {

    private final FreeBoardService freeBoardService;

    // 모든 게시글 조회
    @GetMapping
    public List<FreeBoard> getAllFreeArticles() {
        List<FreeBoard> articles = freeBoardService.getAllArticles();
        log.info("==============> 게시글 조회 성공 : {}", articles);
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

    // 게시글 작성 (DTO 활용 및 입력값 검증)
    @PostMapping
    public ResponseEntity<FreeBoard> createFreeArticle(@Valid @RequestBody FreeBoardRequestDTO articleDTO) {
        FreeBoard article = new FreeBoard();
        article.setTitle(articleDTO.getTitle());
        article.setContent(articleDTO.getContent());
        article.setWriterId(articleDTO.getWriterId());

        FreeBoard createdArticle = freeBoardService.createArticle(article);
        log.info("==============> 게시글 생성 성공 : {}", createdArticle);

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
    public ResponseEntity<Void> deleteFreeArticle(@PathVariable Long id) {
        log.info("=============> 게시글 삭제 요청: ID = {}", id);
        freeBoardService.deleteArticle(id);
        log.info("=============> 게시글 삭제 성공: ID = {}", id);
        return ResponseEntity.noContent().build();
    }
}
