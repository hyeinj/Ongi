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
public class Step5QuestionService {
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

            1. 첫 문장: 사용자가 선택한 감정들 중 하나 이상을 반영하여 담백하게 공감하는 문장
            2. 두 번째 문장: 선택한 감정들 중 하나를 기반으로, 그 감정이 왜 들었는지를 자연스럽게 탐색하는 질문

            작성 시 주의사항:
            - 과장된 위로나 감정적 표현은 피하고, 따뜻하지만 담백한 말투로 작성해주세요
            - 선택된 감정 단어들을 반드시 자연스럽게 포함시켜 문장을 작성해주세요
            - 응답은 정확히 두 문장으로 구성하고, 모든 문장은 정중한 말투(~요)로 끝나야 합니다
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
            스스로 준비를 미리 해두지 않은 자신에게 답답하고 화가 나셨군요.
            무지님이 답답함과 짜증, 초조함을 느꼈던 이유 중 가장 큰 이유는 무엇인가요?
            “나 스스로 준비되지 않았다는 생각이 많이 들었기 때문”
            “팀장님이 나의 실력을 제대로 믿어주시지 않는다는 생각이 들었기 때문”
            “프로젝트가 중요한데 망치기 싫다는 생각이 많이 들었기 때문”

            위의 내용을 바탕으로, 공감을 표현하고 감정의 이유를 탐색하는 질문을 두 문장 이내로 생성해주세요.
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
