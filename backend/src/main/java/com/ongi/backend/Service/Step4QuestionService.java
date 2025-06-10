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
            사용자가 선택한 감정들 중 대표적인 것 1~2개를 반영하여 사용자의 상황과 감정을 부드럽게 공감하는 문장을 한 문장 작성해주세요.
            
            [작성 지침]
            - 출력은 정확히 한 문장으로 작성해주세요.
            - 과장된 위로나 감정적 표현은 피하고, 따뜻하고 공감 어린 말투로 작성해주세요
            - 선택된 감정 단어들 중 일부를 자연스럽게 포함해 작성해주세요.
            - 선택된 감정 단어들을 반드시 자연스럽게 포함시켜 문장을 작성해주세요
            - 정중한 말투(~요)로 끝나야 합니다
            - 출력은 예시 형식을 따르며, 그 외 설명은 포함하지 마세요.
            
            [예시1]
            [Step1 답변 - 인상깊었던 일] 혼자 노을을 보며 걸었어요
            [Step2 답변 - 구체적인 상황 설명] 그냥 걷다가 문득 하늘을 봤는데, 너무 예뻐서 몇 분 동안 가만히 서 있었어요
            [Step3 선택한 감정들] 평온함, 감동
                        
            → 출력:
            노을을 바라보며 멈춰 선 그 시간이 무지님에게 평온하고 감동적인 순간이었을 것 같아요.
            
            [예시2]
            [Step1 답변 - 인상깊었던 일] 친구랑 밥 먹었어요
            [Step2 답변 - 구체적인 상황 설명] 오랜만에 만나서 천천히 밥 먹으면서 얘기했어요
            [Step3 선택한 감정들] 반가움, 따뜻함, 편안함
                        
            → 출력:
            친구와 오랜만에 마주 앉아 편안하게 나눈 대화가 무지님에게 따뜻하게 다가왔을 것 같아요.
            
            [예시3]
            [Step1 답변 - 인상깊었던 일] 발표를 했어요
            [Step2 답변 - 구체적인 상황 설명] 발표를 앞두고 엄청 긴장했는데, 막상 하다보니 잘 끝냈고 칭찬도 들었어요
            [Step3 선택한 감정들] 긴장됨, 뿌듯함, 안도감
                        
            → 출력:
            준비한 발표를 무사히 마치고 칭찬까지 받았던 경험이 무지님에게 뿌듯하면서도 안도되는 순간이었을 것 같아요.
            """);

            ObjectNode userMessage = objectMapper.createObjectNode();
            userMessage.put("role", "user");
            userMessage.put("content", String.format("""
            사용자가 오늘 하루, 가장 인상 깊었던 일에 대해 설명했어요.
            아래는 사용자가 자신의 상황과 감정을 설명한 내용이에요:

            [Step1 답변 - 인상깊었던 일]
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