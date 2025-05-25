package com.ongi.backend.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Service
public class MockLetterService {
    @Value("${openai.api.key}")
    private String apiKey;

    private final String OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String[] generateLetter(
            String step1Answer,
            String step2Answer,
            String step3Feelings,
            String step4Answer,
            String step5Answer
    ) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            ObjectNode requestBody = objectMapper.createObjectNode();
            requestBody.put("model", "gpt-4o-mini");

            ObjectNode systemMessage = objectMapper.createObjectNode();
            systemMessage.put("role", "system");
            systemMessage.put("content", """
            당신은 감정에 섬세하게 공감하고 글을 잘 쓰는 편지 작가입니다.
            아래 사용자가 경험한 감정, 상황, 속마음을 바탕으로 해당 사용자의 이야기를 떠올리게 하는 유사한 사연 편지를 하나 생성해주세요.
                        
            [작성 지침]
            - 편지는 누군가가 무지님에게 보내는 형식입니다.
            - 편지 제목과 본문을 반드시 JSON 배열 형식으로 출력하세요.
              - 배열의 첫 번째 요소(인덱스 0)는 제목이어야 하며, “제목: ”이라는 접두어 없이 제목만 작성해주세요.
              - 배열의 두 번째 요소(인덱스 1)는 편지 본문이어야 하며, “내용: ”이라는 접두어 없이 작성해주세요.
            - 본문은 4~6문장 정도의 길이로 자연스럽고 공감 가는 흐름을 가지도록 작성하고, 1인칭 시점(저는 ~해요)으로 작성합니다.
            - 사용자의 경험에서 완전히 벗어나지 않되, 직접적인 복붙이 아닌 비슷한 맥락의 다른 고민처럼 보이도록 변형해서 작성해주세요.
            - 따옴표(")는 사용하지 마세요.
            
            [예시]
            [
              "자기 계발과 끝없는 업무 속에서, 버텨내는 매일이 너무 힘겹게 느껴져요",
              "무지님, 안녕하세요. 저는 요즘 정말 힘든 시간을 보내고 있습니다. 직장에서는 업무가 끊임없이 늘어나고, 퇴근 후에도 자기 계발을 위한 공부를 해야 하는데 시간이 턱없이 부족해 매일 스트레스로 가득한 나날을 보내고 있어요. 이런 상황에서 어떻게 하면 좋을까요? 무지님은 제 마음을 헤아려주실 수 있을 것 같아요."
            ]    
            
            """);

            ObjectNode userMessage = objectMapper.createObjectNode();
            userMessage.put("role", "user");
            userMessage.put("content", String.format("""
            누군가가 오늘 가장 귀찮았던 일에 대해 설명했어요.
            아래는 사용자가 자기 감정을 탐색하면서 작성한 입력이에요. 이와 유사한 고민을 담은 새로운 사연 편지를 생성해주세요.

            [Step1 답변 - 귀찮았던 일]
            %s

            [Step2 답변 - 구체적인 상황 설명]  
            %s

            [Step3 선택한 감정들]  
            %s
            
            [Step4 답변 - 선택했던 감정이 들었던 자세한 속 마음]
            %s
            
            [Step5 답변 - 감정을 느꼈던 가장 큰 이유]
            %s
            
            """, step1Answer, step2Answer, step3Feelings, step4Answer, step5Answer));

            requestBody.putArray("messages")
                    .add(systemMessage)
                    .add(userMessage);

            HttpEntity<String> request = new HttpEntity<>(requestBody.toString(), headers);

            String response = restTemplate.postForObject(OPENAI_API_URL, request, String.class);
            log.info("OpenAI API 전체 응답: {}", response);

            ObjectNode responseJson = (ObjectNode) objectMapper.readTree(response);
            String getResponse = responseJson.path("choices")
                    .get(0)
                    .path("message")
                    .path("content")
                    .asText();

            // getResponse를 JSON 배열로 파싱 (응답이 유효한 JSON 배열 형식이라고 가정)
            String[] result = objectMapper.readValue(getResponse, String[].class);
            return result;

        } catch (Exception e) {
            log.error("OpenAI API 호출 중 오류 발생", e);
            throw new RuntimeException("OpenAI API 호출 중 오류 발생", e);
        }
    }
}
