package com.ongi.backend.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class Step3QuestionService {
    
    @Value("${openai.api.key}")
    private String apiKey;
    
    private final String OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    public String createQuestionFromAnswer(String step1_answer, String step2_answer) {
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
            사용자의 답변을 바탕으로 과장되지 않고 담백하게 공감을 표현하는 문장을 **두 문장 이내로** 생성해주세요.
            모든 문장은 반드시 정중한 말투(~요)로 끝나야 합니다.
            감정에 적절히 따뜻하게 공감하되, 지나치게 위로나 감정적 표현은 피해주세요.
            """);

            ObjectNode userMessage = objectMapper.createObjectNode();
            userMessage.put("role", "user");
            userMessage.put("content", String.format("""
            누군가가 오늘 가장 귀찮았던 일에 대해 설명했습니다.
            아래는 사용자가 자신의 상황을 설명한 내용입니다:

            [Step1 답변 - 상황]  
            %s

            [Step2 답변 - 구체적인 상황]  
            %s

            위의 내용을 바탕으로, 담백하게 공감하는 문장을 두 문장 이내로 생성해주세요.
            """, step1_answer, step2_answer));

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
            
            return getResponse + "\n그럼 우리 한 발짝 물러나서 감정을 살펴볼게요";
                            
        } catch (Exception e) {
            log.error("OpenAI API 호출 중 오류 발생", e);
            throw new RuntimeException("OpenAI API 호출 중 오류 발생", e);
        }
    }
} 