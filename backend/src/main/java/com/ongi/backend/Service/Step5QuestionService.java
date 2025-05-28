package com.ongi.backend.Service;

import com.fasterxml.jackson.core.type.TypeReference;
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
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
public class Step5QuestionService {
    @Value("${openai.api.key}")
    private String apiKey;

    private final String OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public Map<String, Object> createQuestionFromAnswer(
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
            당신은 감정 분석과 공감에 능숙한 상담사입니다. 
            사용자의 답변을 바탕으로 세 가지 텍스트를 생성해주세요:
            
            1. smallText: 사용자가 Step4에서 자세히 설명한 감정과 속마음에 대한 공감 메시지 (1문장, ~셨군요로 끝남)
               - Step4의 감정 설명을 가장 중요하게 참고하여 작성해주세요
               - 사용자가 자신의 감정을 어떻게 이해하고 있는지에 초점을 맞춰주세요
               - 다른 단계의 내용은 보조적으로만 참고해주세요
                        
            2. largeText: 감정의 핵심 원인을 추론하고 확인하는 질문 (2문장 내외, 정중한 말투)
               - 가장 가능성이 높은 원인 하나를 선택하여 질문해주세요
               - 이 원인은 options에 포함되지 않아야 합니다
                        
            3. options: 감정의 가능한 원인들을 3개의 선택지로 제시 (반드시 '~때문' 형식으로 끝남)
               - largeText에서 제시한 원인과는 다른, 추가적인 가능성들을 유추하여 제시해주세요
               - 사용자의 답변에서 발견할 수 있는 다른 관점이나 원인들도 포함해주세요
                        
            largeText는 다음 패턴을 따라주세요:
            "무지님이 [감정들]을 느꼈던 이유 중 가장 큰 이유는 [원인] 때문이 맞을까요?"
                        
            응답 형식:
            {
              "smallText": "생성된 공감 메시지",
              "largeText": "생성된 확인 질문",
              "options": [
                "첫 번째 가능한 원인 (largeText와 다른 원인)",
                "두 번째 가능한 원인 (largeText와 다른 원인)",
                "세 번째 가능한 원인 (largeText와 다른 원인)"
              ]
            }
                        
            JSON 형식으로만 응답해주세요.
                        
            options 예시:
            [
                '상황이 예상과 달랐기 때문',
                '준비가 부족했다고 느꼈기 때문',
                '다른 사람의 반응이 걱정되었기 때문',
            ]
                        
            작성 시 주의사항:
            - options의 모든 선택지는 반드시 '~때문' 형식으로 끝나야 합니다
            - 각 이유는 따옴표(")는 사용하지 말고, 한 문장 이내로 작성해주세요
            """);

            ObjectNode userMessage = objectMapper.createObjectNode();
            userMessage.put("role", "user");
            userMessage.put("content", String.format("""
            누군가가 오늘 가장 인상깊었던 일에 대해 설명했어요.
            아래는 사용자가 자신의 상황과 감정을 설명한 내용이에요:

            [Step1 답변 - 인상깊었던 일]
            %s

            [Step2 답변 - 구체적인 상황 설명]  
            %s

            [Step3 선택한 감정들]  
            %s
            
            [Step4 답변 - 선택했던 감정이 들었던 자세한 속 마음]
            %s
            
            위 답변들을 바탕으로 사용자의 감정과 상황에 공감하는 smallText와, 감정의 핵심 원인을 묻는 largeText, 그리고 가능한 원인들을 3개의 선택지로 제시하는 options를 JSON 형식으로 생성해주세요.
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

            // content를 다시 JSON으로 파싱 후 Map으로 변환
            ObjectNode parsedContent = (ObjectNode) objectMapper.readTree(content);
            Map<String, Object> result = objectMapper.convertValue(parsedContent, new TypeReference<Map<String, Object>>() {});

            return result;

        } catch (Exception e) {
            log.error("OpenAI API 호출 중 오류 발생", e);
            throw new RuntimeException("OpenAI API 호출 중 오류 발생", e);
        }
    }
}
