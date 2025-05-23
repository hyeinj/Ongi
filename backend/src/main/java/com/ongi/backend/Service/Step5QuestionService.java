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

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class Step5QuestionService {
    @Value("${openai.api.key}")
    private String apiKey;

    private final String OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<String> createQuestionFromAnswer(
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
            사용자의 상황 설명과 감정을 바탕으로, 해당 감정을 느꼈던 가장 큰 이유 후보 2~3가지를 아래 형식대로 제안해주세요.
                        
            형식 예시:
            “나 스스로 준비되지 않았다는 생각이 많이 들었기 때문”
            “팀장님이 나의 실력을 제대로 믿어주시지 않는다는 생각이 들었기 때문”
            “프로젝트가 중요한데 망치기 싫다는 생각이 많이 들었기 때문”
                        
            작성 시 주의사항:
            - 모든 이유는 반드시 '~때문' 형식으로 끝나야 합니다
            - 후보는 2~3가지 작성해주세요
            - 각 이유는 따옴표(")는 사용하지 말고, 한 문장 이내로 작성해주세요
            - 이유는 개행하여 줄바꿈된 형태로 나열해주세요
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
            
            위의 내용을 바탕으로, 감정을 느꼈던 가장 큰 이유 후보 2~3가지를 위에서 안내한 형식으로 생성해주세요.
            """, step1Answer, step2Answer, step3Feelings, step4Answer));

            requestBody.putArray("messages")
                    .add(systemMessage)
                    .add(userMessage);

            HttpEntity<String> request = new HttpEntity<>(requestBody.toString(), headers);

            String response = restTemplate.postForObject(OPENAI_API_URL, request, String.class);
            log.info("OpenAI API 전체 응답: {}", response);

            ObjectNode responseJson = (ObjectNode) objectMapper.readTree(response);
            String content = responseJson.path("choices")
                    .get(0)
                    .path("message")
                    .path("content")
                    .asText();

            // 응답에서 이유 리스트 추출
            return Arrays.stream(content.split("\n"))
                    .map(String::trim)
                    .filter(line -> !line.isEmpty())
                    .collect(Collectors.toList());

        } catch (Exception e) {
            log.error("OpenAI API 호출 중 오류 발생", e);
            throw new RuntimeException("OpenAI API 호출 중 오류 발생", e);
        }
    }
}
