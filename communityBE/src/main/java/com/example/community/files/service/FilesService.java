package com.example.community.files.service;

import com.example.community.board.model.Board;
import com.example.community.files.model.Files;
import com.example.community.files.repository.FilesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files as JavaFiles;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FilesService {

    private final FilesRepository filesRepository;

    // 파일 업로드 처리
    public Files storeFile(MultipartFile file, Long postId, Board board, String uploadDir) throws IOException {
        String originalFileName = file.getOriginalFilename();
        String fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        String uniqueFileName = UUID.randomUUID().toString() + fileExtension;

        Path path = Paths.get(uploadDir + uniqueFileName);

        // 디렉토리가 존재하지 않으면 생성
        if (!JavaFiles.exists(path.getParent())) {
            JavaFiles.createDirectories(path.getParent());
        }

        // 파일을 경로에 저장
        JavaFiles.write(path, file.getBytes());

        // 파일 엔티티 생성 및 저장
        Files uploadedFile = new Files();
        uploadedFile.setFileName(originalFileName);
        uploadedFile.setFilePath(path.toString());
        uploadedFile.setFileSize(file.getSize());
        uploadedFile.setContentType(file.getContentType());
        uploadedFile.setPostId(postId);
        uploadedFile.setBoard(board);  // Board 엔티티 설정

        return filesRepository.save(uploadedFile);
    }
}
