package com.ongi.backend.Service;

import com.ongi.backend.DTO.RealStoryDTO;
import com.ongi.backend.DTO.ResponseDTO;
import com.ongi.backend.Entity.RealStory;
import com.ongi.backend.Repository.RealStoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class RealStoryService {
    private final RealStoryRepository realStoryRepository;

    // 실제 사연 저장
    public ResponseDTO<RealStoryDTO.realStoryResponseDTO> saveRealStory(RealStoryDTO.realStoryRequestDTO request) {
        RealStory realStory = new RealStory();
        realStory.setLetter(request.getLetter());
        realStory.setResponse(request.getResponse());

        RealStory savedRealStory = realStoryRepository.save(realStory);

        // 미리보기 텍스트 생성 (200자로 제한)
        String letterPreview = request.getLetter().length() > 200
                ? request.getLetter().substring(0, 200) + "..."
                : request.getLetter();

        String responsePreview = request.getResponse().length() > 200
                ? request.getResponse().substring(0, 200) + "..."
                : request.getResponse();

        RealStoryDTO.realStoryResponseDTO responseDTO =
                new RealStoryDTO.realStoryResponseDTO(
                        savedRealStory.getRealstoryId(),
                        "실제 사연이 성공적으로 저장되었습니다.",
                        letterPreview,
                        responsePreview
                );

        return ResponseDTO.success("실제사연 등록 완료", responseDTO);
    }
}
