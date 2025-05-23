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
public class Step6QuestionService {
    @Value("${openai.api.key}")
    private String apiKey;

    private final String OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String createQuestionFromAnswer(
            String step1Answer,
            String step2Answer,
            String step3Feelings,
            String step4Answer
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
            당신은 공감 능력이 뛰어난 상담사입니다.
            사용자의 상황 설명과 선택한 감정을 바탕으로 다음과 같은 형식으로 응답해주세요:

            응답은 반드시 한 문장으로 작성하며, "~ 오늘이 무지님에게 어떤 하루로 기억될까요?"로 끝나야 합니다.
            또한, 따옴표(")는 사용하지 마세요.

            작성 시 주의사항:
            - 과장된 위로나 감정적 표현은 피하고, 따뜻하지만 담백한 말투로 작성해주세요
            - 선택된 감정 단어들을 반드시 자연스럽게 포함시켜 문장을 작성해주세요
            - 응답은 정확히 한 문장으로 구성하고, 모든 문장은 정중한 말투(~요)로 끝나야 합니다
            
            예: 충분히 감정을 되짚으며 짜증의 진짜 이유를 바라본 오늘이, 무지님에게 어떤 하루로 기억될까요?
            """);

            ObjectNode userMessage = objectMapper.createObjectNode();
            userMessage.put("role", "user");
            userMessage.put("content", String.format("""
            누군가가 오늘 가장 귀찮았던 일에 대해 설명했어요.
            아래는 사용자가 자신의 상황과 감정을 설명한 내용이에요:

            [Step1 답변 - 귀찮았던 일]
            %s

            [Step2 답변 - 구체적인 상황 설명]  
            %s

            [Step3 선택한 감정들]  
            %s
            
            [Step4 답변 - 선택했던 감정이 들었던 자세한 속 마음]
            %s
            
            예시:
            충분히 감정을 되짚으며 짜증의 진짜 이유를 바라본 오늘이, 무지님에게 어떤 하루로 기억될까요?

            위의 내용을 바탕으로,
            사용자가 느낀 감정에 공감하고,
            그 감정의 진짜 이유나 의미를 되짚어보게 하는 질문을 한 문장으로 생성해주세요.
            """, step1Answer, step2Answer, step3Feelings, step4Answer));

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

            return getResponse;

        } catch (Exception e) {
            log.error("OpenAI API 호출 중 오류 발생", e);
            throw new RuntimeException("OpenAI API 호출 중 오류 발생", e);
        }
    }
}
