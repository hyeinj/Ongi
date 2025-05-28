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

import java.util.Map;

@Slf4j
@Service
public class SelfSummaryService {
    @Value("${openai.api.key}")
    private String apiKey;

    private final String OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String createSummaryFromAnswer(
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
            당신은 공감 능력이 뛰어난 상담사이며, 사용자가 자기 감정을 탐색하는 과정을 따뜻하고 진정성 있게 정리하는 글을 작성합니다.
            아래 사용자 입력을 바탕으로 아래 형식에 맞추어 한 편의 자기공감 메시지를 작성해주세요:
                        
            [구성]
            1. 오늘 사용자가 어떤 상황에서 어떤 감정을 느꼈고, 왜 그런 감정을 느꼈는지 요약해줍니다.
            2. 사용자가 그 감정을 따라가며 그 진짜 이유를 어떻게 바라보았는지, 앞으로 비슷한 상황이 다가왔을 때의 응원의 말을 제시해줍니다.
            3. 마지막으로 오늘의 자기공감 경험이 사용자에게 어떤 의미였는지를 따뜻한 말투로 정리하며 격려의 말을 건네주세요.
                        
            [작성 지침]
            - 과장된 위로나 감정적 표현은 피하고, 따뜻하지만 담백한 말투로 작성해주세요.
            - 전체 문장은 3문단으로 구성해주세요.
            - "무지님은 오늘..."으로 시작하며, 마지막 문장은 "오늘의 무지님은, ~ 하고 있어요"로 마무리해주세요.
            - 선택된 감정 단어를 반드시 자연스럽게 포함시켜 작성해주세요.
            - 따옴표(")는 사용하지 마세요.
            
            [예시1]
            무지님은 오늘 옷을 고르는 평범한 상황 속에서 답답함과 짜증이라는 감정을 느꼈어요. 그 감정은 단순한 불편함이 아니라 ‘시간을 효율적으로 써야 한다’는 내면의 기준에서 비롯된 것이었죠
                        
            그 짜증을 따라가며 무지님은 왜 그런 감정이 들었는지, 무엇을 기대하고 있었는지를 상황의 맥락과 자신의 가치 기준과 연결해 바라보았어요. 앞으로 비슷한 순간에, 자신을 덜 다그치고 더 부드럽게 조율할 수 있는 실마리가 될 거에요.
                        
            오늘 무지님은, 짜증이라는 감정 속에서, 스스로를 더 다정하게 대하는 방법을 찾고 있어요.
                        
            [예시 2]
            무지님은 오늘 친구와의 대화 속에서 함께 있으면 마음이 편해진다는 친구의 말에 뿌듯함과 설렘의 감정을 느꼈어요. 그 감정은 단순히 말에서 오는 설렘이 아닌, 친구에게 다가가기 어려웠던 과거의 무지님을 극복했다는 내면의 성장에서 비롯된 것이었죠.
                        
            뿌듯함의 감정을 따라가며 무지님은 “왜 그런 감정이 들었는지”, “그 감정이 느끼게 된 과거의 다른 사건들이 무엇인지”를 상황의 맥락과 자신의 과거 경험을 연결해서 바라보았어요.
            앞으로 수많은 극복의 순간들 속에서, 이 경험은 더 큰 뿌듯함을 불러올 수 있을 것이라 확신해요
                        
            오늘의 무지님은, 뿌듯함의 감정 속에서 본인의 힘듦을 극복하며 한단계 더 성장했어요.
            
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
            
            [Step5 답변 - 감정을 느꼈던 가장 큰 이유]
            %s
            
            이 내용을 바탕으로, 위 지침에 맞는 따뜻한 자기공감 메시지를 생성해주세요.
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

            return getResponse;

        } catch (Exception e) {
            log.error("OpenAI API 호출 중 오류 발생", e);
            throw new RuntimeException("OpenAI API 호출 중 오류 발생", e);
        }
    }

    public Map<String, String> createCategory(
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
            당신은 감정 분석 전문가입니다.
            사용자의 모든 답변을 종합 분석하여 오늘 하루의 주요 감정과 카테고리를 결정해주세요.
                        
            카테고리 옵션:
            - self: 자기 자신과 관련된 감정 (자아, 자존감, 개인적 고민)
            - growth: 성장과 발전과 관련된 감정 (학습, 도전, 개선)
            - routine: 일상과 루틴과 관련된 감정 (습관, 반복, 생활패턴)
            - relationship: 인간관계와 관련된 감정 (가족, 친구, 동료, 연인)
                        
            감정 옵션:
            - joy: 기쁨, 행복, 만족감
            - sadness: 슬픔, 우울, 허무함
            - anger: 분노, 짜증, 불만
            - anxiety: 불안, 걱정, 초조함
            - peace: 평온, 차분함, 안정감
                        
            응답 형식: {"category": "선택한카테고리", "emotion": "선택한감정"}
            JSON 형식으로만 응답해주세요.
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
            
            [Step5 답변 - 감정을 느꼈던 가장 큰 이유]
            %s
            
            이 답변들을 종합해서 사용자의 오늘 하루를 가장 잘 나타내는 카테고리와 감정을 JSON 형식으로 응답해주세요.
            """, step1Answer, step2Answer, step3Feelings, step4Answer, step5Answer));

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

            // content를 JSON 파싱 후 Map으로 변환
            ObjectNode parsedContent = (ObjectNode) objectMapper.readTree(content);
            return objectMapper.convertValue(parsedContent, new TypeReference<Map<String, String>>() {});

        } catch (Exception e) {
            log.error("OpenAI API 호출 중 오류 발생", e);
            throw new RuntimeException("OpenAI API 호출 중 오류 발생", e);
        }
    }
}
