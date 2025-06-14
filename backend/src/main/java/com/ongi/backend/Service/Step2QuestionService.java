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
public class Step2QuestionService {
    
    @Value("${openai.api.key}")
    private String apiKey;
    
    private final String OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    public String createQuestionFromAnswer(String answer) {
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
            사용자의 답변에 대해 공감하고 감정을 이해하는 응답을 생성해주세요.
            응답은 반드시 한 문장으로 작성하며, "~셨군요"로 끝나야 합니다.
            또한, 따옴표(")는 사용하지 마세요.
            """);

            ObjectNode userMessage = objectMapper.createObjectNode();
            userMessage.put("role", "user");
            userMessage.put("content", String.format("""
              다음 입력은 "오늘, 조용히 마음이 무거워졌던 때가 있다면 어떤 순간이었을까요?"라는 질문에 대한 사용자의 답변입니다.
              이에 대해 공감하고 감정을 담은 문장을 하나 생성해주세요.
             
              응답은 반드시 한 문장으로 작성하며, "~셨군요"로 끝나야 합니다.
              또한 따옴표(")는 사용하지 말아야 합니다.
             
              입력 문장이 단어 하나일 수도, 문장일 수도 있습니다.
              어떤 경우든 사용자의 경험을 요약하고 감정을 공감하는 문장을 만들어주세요.
             
              다음은 예시입니다:
              입력: 산책
              출력: 오늘의 산책이 무지님에게 인상 깊으셨군요
             
              입력: 과제가 너무 많았어
              출력: 과제가 많아 힘든 하루를 보내셨군요
             
              다음 입력에 대해 공감 문장을 생성해주세요: %s
            """, answer));

            requestBody.putArray("messages")
                .add(systemMessage)
                .add(userMessage);
            
            HttpEntity<String> request = new HttpEntity<>(requestBody.toString(), headers);
            
            String response = restTemplate.postForObject(OPENAI_API_URL, request, String.class);
            log.info("OpenAI API 전체 응답: {}", response);
            
            // 응답에서 실제 메시지 내용만 추출
            ObjectNode responseJson = (ObjectNode) objectMapper.readTree(response);
            String getResponse = responseJson.path("choices")
                            .get(0)
                            .path("message")
                            .path("content")
                            .asText();
            
            return "솔직하게 나눠주셔서 감사해요 \n" + getResponse;
                            
        } catch (Exception e) {
            log.error("OpenAI API 호출 중 오류 발생", e);
            throw new RuntimeException("OpenAI API 호출 중 오류 발생", e);
        }
    }
} 