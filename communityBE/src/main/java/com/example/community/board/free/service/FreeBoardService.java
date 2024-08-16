package com.example.community.board.free.service;

import com.example.community.board.free.model.FreeBoard;
import com.example.community.board.free.repository.FreeBoardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor  // Lombok을 사용해 의존성 자동 주입
public class FreeBoardService {

    private final FreeBoardRepository freeBoardRepository;  // 레포지토리 의존성 주입


    // 모든 게시글 조회
    public List<FreeBoard> getAllArticles() {
        return freeBoardRepository.findAll();
    }


    // 특정 게시글 조회
    public Optional<FreeBoard> getArticleById(Long id) {
        return freeBoardRepository.findById(id);
    }


    // 게시글 생성
    public FreeBoard createArticle(FreeBoard article) {
        return freeBoardRepository.save(article);
    }


    // 게시글 수정
    public FreeBoard updateArticle(Long id, FreeBoard updatedArticle) {
        // 기존 게시글을 조회
        Optional<FreeBoard> articleOpt = freeBoardRepository.findById(id);

        if (articleOpt.isPresent()) {
            // 기존 게시글이 존재하면 가져오기
            FreeBoard existingArticle = articleOpt.get();

            // 기존 writerId를 유지한 상태에서 title, content, updatedAt만 수정
            existingArticle.setTitle(updatedArticle.getTitle());
            existingArticle.setContent(updatedArticle.getContent());
            existingArticle.setUpdatedAt(LocalDateTime.now());  // 수정 시간을 현재 시간으로 설정

            // 수정된 게시글 저장 후 반환
            return freeBoardRepository.save(existingArticle);
        }

        // 게시글이 없을 경우 예외를 던지거나 null을 반환 (상황에 맞게 처리)
        throw new RuntimeException("해당 게시글을 찾을 수 없습니다.");
    }


    // 게시글 삭제
    public void deleteArticle(Long id) {
        freeBoardRepository.deleteById(id);
    }
}
