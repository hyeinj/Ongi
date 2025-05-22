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
            다음 입력은 "오늘 가장 귀찮게 느껴졌던 건 무엇이었나요?"라는 질문에 대한 사용자의 답변입니다.
            이에 대해 공감하고 감정을 이해하는 응답 문장을 생성해주세요.

            응답은 반드시 **한 문장**으로 작성하고, "기호(따옴표)"는 사용하지 마세요.
            응답 문장은 아래의 패턴을 따르세요:

            - 입력 내용을 요약한 후, 감정에 공감하는 문장을 만들어주세요.
            - 문장은 "~셨군요"로 끝나야 합니다.

            예시:
            입력: 논문작성  
            출력: 논문 작성할 때 귀찮음을 느끼셨군요

            입력: 아침에 옷 고르는게 힘들었어요  
            출력: 아침에 옷을 고르는 일이 힘드셨군요

            입력: 회의가 너무 길어서 지쳤어요  
            출력: 긴 회의로 인해 지치셨군요

            아래 입력에 대해 응답 문장 하나를 생성해주세요:
            %s
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