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
public class Step4QuestionService {
    
    @Value("${openai.api.key}")
    private String apiKey;
    
    private final String OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    public String createQuestionFromAnswer(
        String step1Answer,
        String step2Answer,
        String step3Feelings
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

            1. 첫 문장: 사용자가 선택한 감정들 중 하나 이상을 반영하여 사용자의 상황과 감정을 부드럽게 공감하는 문장
            2. 두 번째 문장: 반드시 다음 형식을 그대로 사용해주세요:
               "[선택한 감정 단어(들)]의 느낌이 들었던 무지님의 속 마음을 조금 더 말해주실 수 있나요?"

            작성 시 주의사항:
            - 과장된 위로나 감정적 표현은 피하고, 따뜻하고 공감 어린 말투로 작성해주세요
            - 첫 문장에는 선택된 감정 단어들 중 일부를 자연스럽게 포함해 작성해주세요.
            - 두 번째 문장에서는 감정 단어가 단순 나열이 아니라, 문법에 맞고 부드럽게 이어진 표현이 되도록 작성해주세요.
              - 예: "짜증남의 느낌이 들었던", "설레고 뿌듯함의 느낌이 들었던"
              - 비예: "짜증남, 피곤함, 지침의 느낌이 들었던" (X)
            - 선택된 감정 단어들을 반드시 자연스럽게 포함시켜 문장을 작성해주세요
            - 응답은 정확히 두 문장으로 구성하고, 모든 문장은 정중한 말투(~요)로 끝나야 합니다
            
            [예시 1]
            귀찮은 것을 마주했을때, 무지님의 마음이 많이 복잡했을 것 같아요.
            짜증남의 느낌이 들었던 무지님의 속 마음을 조금 더 말해주실 수 있나요?
            
            [예시 2]
            친구와 더 깊은 이야기를 나누고싶은 상황들 속에서, 무지님의 마음이 많이 설렜을 것 같아요.
            설레고, 뿌듯함을 느꼈던 무지님의 속 마음이 궁금해요. 그 말과 상황속의 어떤 것이 가장 설레고, 뿌듯함을 느끼게 했나요?
            
            [예시 3]
            누군가에게 평가를 받는다는 것은, 굉장히 긴장되고 떨리는 일인 것 같아요.
            무서운 느낌이 들었던 무지님의 속 마음을 조금 더 말해주실 수 있나요?
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
            """, step1Answer, step2Answer, step3Feelings));

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