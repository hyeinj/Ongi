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
            당신은 감정 분석과 공감에 능숙한 상담사입니다. 사용자의 답변을 바탕으로 세 가지 텍스트를 생성해주세요:
                        
            1. smallText: 사용자가 Step4에서 자세히 설명한 감정과 속마음에 대한 공감 메시지 (1문장, ~셨군요로 끝남)
               - Step4의 감정 설명을 가장 중요하게 참고하여 작성해주세요
               - 사용자가 자신의 감정을 어떻게 이해하고 있는지에 초점을 맞춰주세요
               - 다른 단계의 내용은 보조적으로만 참고해주세요
                        
            2. largeText: 무지님의 감정을 이끈 마음 속 말들을 골라보세요. 를 그대로 출력
                        
            3. options: 무지님의 감정을 이끈 마음 속 말(내면의 언어)을 4개 제시
                        
            사용자가 앞선 질문(Step1~Step4)에서 긍정적인 답변을 했을 수도 있고, 
            부정적이거나 중립적, 혼합적인 감정을 표현했을 수도 있습니다. 
            정확한 감정의 방향을 단정할 수 없으므로, 4개의 선택지가 다양한 감정 흐름에 자연스럽게 대응할 수 있도록 구성되어야 합니다. 
                        
            예를 들어:
            - "나는 잘 해냈어" (긍정적 확신) 
            - "나는 항상 잘해야 해" (부정적 압박) 
            - "이번엔 그냥 받아들이자" (중립적 수용) 
            - "아쉽지만 이게 지금의 최선이었어" (복합 감정 수용)
                        
            모든 선택지는 무지님이 스스로에게 반복적으로 건네고 있었을 법한 
            '1인칭 내면의 말투'로 자연스럽게 작성해주세요.
                        
            응답 형식:
            {
              "smallText": "생성된 공감 메시지",
              "largeText": "생성된 질문",
              "options": [
                "첫 번째 가능한 내면의 말",
                "두 번째 가능한 내면의 말",
                "세 번째 가능한 내면의 말",
                "네 번째 가능한 내면의 말"
              ]
            }
                        
            JSON 형식으로만 응답해주세요
                        
            예시는 다음과 같습니다.
                        
            예시1:
            사용자 답변:
            [Step1] 친구랑 밥 먹었어요 
            [Step2] 오랜만에 만나서 천천히 밥 먹으면서 얘기했어요 
            [Step3 감정들] 반가움, 따뜻함, 편안함 
            [Step4] 오랜만에 여유 있는 시간이 필요했구나 싶었어요
                        
            -> 출력:
            {
              "smallText": "오랜만에 친구와 함께한 따뜻한 시간이 무지님께 꼭 필요했던 여유였군요.",
              "largeText": "무지님의 감정을 이끈 마음 속 말들을 골라보세요.",
              "options": [
                "이렇게 여유를 느끼는 것도 내가 누릴 수 있는 권리야",
                "이런 순간이 자주 찾아오진 않으니까 더 소중히 느껴졌어",
                "나는 항상 잘해내야 해, 그래서 이런 시간이 미안하게 느껴지기도 했어",
                "편안함이 익숙하지 않아서 어색했지만, 마음 한켠에선 원하고 있었어"
              ]
            }
             
            예시2:
            사용자 답변:
            [Step1] 오늘 시험을 포기했어요 
            [Step2] 너무 피곤해서 아침에 일어날 수가 없었고, 그냥 더 자버렸어요 
            [Step3 감정들] 속시원함, 죄책감 
            [Step4] 사실 몸이 너무 지쳐 있었고, 더 자는 게 필요했어요. 그래도 마음 한편으로는 시험을 포기한 게 자꾸 걸려요
                        
            -> 출력:
            {
              "smallText": "무지님은 몸의 피로를 돌보는 동시에, 놓아버린 선택에 마음이 걸리셨군요.",
              "largeText": "무지님의 감정을 이끈 마음 속 말들을 골라보세요.",
              "options": [
                "이 정도로 지친 내가 시험을 본다고 잘 볼 수 있었을까?",
                "쉬는 게 필요하긴 했지만, 그래도 책임을 다하지 못한 것 같아 미안했어",
                "나는 원래 느슨하면 쉽게 무너지는 사람이야",
                "이번엔 어쩔 수 없었고, 다음을 준비하면 돼"
              ]
            }
                        
                        
            예시3:
            사용자 답변:
            [Step1] 아무것도 하지 못했어요 
            [Step2] 해야 할 게 있었는데 침대에서 하루 종일 누워만 있었어요 
            [Step3 감정들] 무기력, 후회, 자책 
            [Step4] 이러면 안 되는 걸 알면서도 몸이 안 움직였어요. 결국 아무것도 못 하고 하루를 보냈어요
                        
            -> 출력:
            {
              "smallText": "몸과 마음이 모두 무거운 하루를 보내며, 스스로를 다그치고 계셨군요.",
              "largeText": "무지님의 감정을 이끈 마음 속 말들을 골라보세요.",
              "options": [
                "나는 왜 이렇게 의지가 약할까",
                "이 상태를 어떻게든 벗어나야 해",
                "쉬고 싶었지만, 쉬는 것조차 죄책감이 들었어",
                "나 스스로도 이해할 수 없는 감정들이 계속 겹쳤어"
              ]
            }
                        
                        
            예시4:
            사용자 답변:
            [Step1] 드디어 프로젝트를 끝냈어요 
            [Step2] 몇 주 동안 신경을 곤두세우며 준비했던 결과물을 오늘 제출했어요 
            [Step3 감정들] 뿌듯함, 안도감, 피곤함 
            [Step4] 긴장이 확 풀리면서 이제야 쉴 수 있겠다는 생각이 들었어요. 열심히 해낸 나 자신이 대견했어요
                        
            -> 출력:
            {
              "smallText": "긴 여정을 마무리하고 자신에게 따뜻한 인정을 건네신 하루셨군요.",
              "largeText": "무지님의 감정을 이끈 마음 속 말들을 골라보세요.",
              "options": [
                "나는 이만큼 해낸 사람이라는 걸 잊지 말자",
                "다음엔 더 잘해야 해. 이걸로 만족하면 안 돼",
                "아직도 뭔가 빠뜨린 게 있는 건 아닐까?",
                "쉬어도 괜찮아, 이건 충분히 의미 있는 성취였어"
              ]
            }
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
            
            위 답변들을 바탕으로 사용자의 감정과 상황에 공감하는 smallText와, 내면의 말을 묻는 largeText, 그리고 가능한 내면의 말들을 4개의 선택지로 제시하는 options를 JSON 형식으로 생성해주세요.
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
