package com.ongi.backend.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.ongi.backend.DTO.ResponseDTO;
import com.ongi.backend.DTO.SelfEmpathyDTO;
import com.ongi.backend.Entity.Report;
import com.ongi.backend.Entity.SelfEmpathy;
import com.ongi.backend.Repository.ReportRepository;
import com.ongi.backend.Repository.SelfEmpathyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class SelfSummaryService {
    @Value("${openai.api.key}")
    private String apiKey;

    private final String OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final SelfEmpathyRepository selfEmpathyRepository;
    private final ReportRepository reportRepository;

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
            당신은 공감 능력이 뛰어난 상담사이며, 사용자가 자기 감정을 탐색하는 과정을 진정성 있고 따뜻하게 정리하는 글을 작성합니다.
            아래 사용자 입력을 바탕으로, 자기공감 메시지를 다음 구성에 맞추어 작성해주세요.
                        
            [구성]   
            1. 오늘 사용자가 어떤 상황에서 어떤 감정을 느꼈고, 왜 그런 감정을 느꼈는지를 요약해주세요.
            2. 사용자가 그 감정을 따라가며 떠올린 내면의 말들, 그리고 그 말들을 어떻게 받아들였는지 표현해주세요.
               - 내면의 말이 조심스럽거나 익숙하지 않은 말이라면, 그 말에 다가가는 태도나 질문을 표현해주세요.
               - 내면의 말이 힘이 되었거나 나를 지지해주는 말이라면, 그 말을 받아들이거나 따뜻하게 확인하는 마음을 표현해주세요.
            3. 자기공감의 여정을 마무리하며, 오늘의 자신을 다정하게 바라보는 문장으로 끝내주세요.
                        
            [작성 지침]  
            - "무지님"이라는 호칭은 사용하지 않고, 사용자가 스스로에게 이야기하듯 1인칭 시점으로 작성해주세요.
            - 전체 문장은 3문단으로 구성해주세요.
            - 450자 이내로 작성해주세요.
            - 감정 단어는 자연스럽게 문장에 녹여서 포함해주세요.
            - 감정이나 내면의 말에 따라 자연스럽게 조화를 이루는 태도를 표현해주세요:
               - 조심스러운 말일 땐, 유보하거나 질문하는 마음
               - 나를 지지하는 말일 땐, 받아들이거나 다정하게 강화하는 마음
            - 마무리 문장은 다음 중 어울리는 톤으로 1~2줄로 구성해주세요:
               - 오늘의 나는, 불안한 마음 속에서도 나를 이해하려고 애쓰고 있었어요.
               - 오늘의 나는, 내 안에서 반복되던 말들을 조용히 바라보며, 그 말들 너머의 나를 이해하려고 애쓰고 있었어요.
               - 오늘의 나는, 나에게 힘이 되는 말을 기꺼이 받아들이며 하루를 살아냈어요.
               - 오늘의 나는, 내 안에서 올라온 건강한 목소리를 조용히 따라가며 나를 지지하고 있었어요.
                        
                        
            [예시]
            - 예시1:
            오늘 나는 친구와 만나 오랜만에 따뜻하고 편안한 시간을 보냈지만, 그 안에서도 어딘가 모를 긴장감이 함께 있었어요. 그 감정은 ‘이 순간을 잘 보내야 한다’는 마음에서 비롯된 걸지도 모르겠어요.
            그러다 문득, 내가 자주 하는 마음속 말을 떠올렸어요. “나는 항상 잘해야 해.” 이 말이 지금도 나를 붙잡고 있는 걸까, 조용히 스스로에게 물어보게 됐어요.
            오늘의 나는, 불안한 마음 속에서도 나를 이해하려고 애쓰고 있었어요. 그런 나를, 조금 더 믿어주고 싶어요.
                        
            - 예시2:
            오늘 나는 친구와 오랜만에 마주 앉아 여유롭게 대화를 나누었어요. 따뜻하고 편안한 기분이 들어서, 그 순간만큼은 시간을 천천히 흘려보낼 수 있었어요.
            생각해보면, "나는 이렇게 있어도 괜찮아", "이런 시간이 참 좋다" 같은 말들이 마음 깊은 곳에서 올라왔던 것 같아요. 내가 나에게 오랜만에 허락해준 안정감이었을지도 모르겠어요.
            오늘의 나는, 익숙하지 않았던 다정한 말들을 조용히 받아들이며 하루를 보냈어요.
                        
            - 예시3:
            오늘 나는 발표를 마치고 나서 뿌듯하면서도 약간의 허탈함, 안도감이 함께 뒤섞인 기분이 들었어요. 아마 “끝냈으니 됐어”라는 내면의 말과 “더 잘했어야 하는 거 아냐?”라는 또 다른 말이 동시에 내 마음에 있었기 때문일 거예요.
            그 말들을 곧장 밀어내거나 따라가지 않고, 그냥 거기에 있는 말들로 받아들이려고 했어요.
            오늘의 나는, 내 안에서 반복되던 말들을 조용히 바라보며, 그 말들 너머의 나를 이해하려고 애쓰고 있었어요.
                        
            - 예시4:
            오늘 나는 무기력한 마음으로 하루를 보냈어요. 뭘 해야 할지 몰라 멍하니 시간을 보내기도 했고, 그 속에서 스스로에게 수없이 말을 걸고 있었던 것 같아요.
            그 중에서도 "이래도 괜찮은 걸까?", "나는 지금 뭘 놓치고 있는 건 아닐까?" 같은 말들이 마음 한켠을 계속 맴돌았어요. 아무것도 하지 못한 나에게 쏟아지는 말들 속에서, 나는 내가 진짜 하고 싶었던 이야기를 찾고 있었는지도 몰라요.
            오늘의 나는, 그런 말들 사이에서 조용히 내 마음의 소리를 들어보려 애쓰고 있었어요.
                        
            - 예시5:
            오늘 나는 뭔가를 하려고 했지만, 자꾸만 흐름이 끊겨서 집중하지 못했어요. 초조함과 답답함이 계속 쌓이면서도, 내내 '왜 이렇게 안 되지?'라는 생각을 떨칠 수 없었어요.
            마음속 어딘가에서는 “오늘은 무언가 해내야 하는 날이었어” 같은 말이 맴돌고 있었어요. 하지만 그 말에 너무 끌려가지 않으려 조심스레 한 발 물러서 보려고 했어요.
            오늘의 나는, 스스로에게 조용히 질문을 던지며 그 말의 무게를 바라보고 있었어요.
                        
            - 예시6:
            오늘 나는 더운 날씨에 몸을 움직이며 작업하러 나갔어요. 지치는 순간이었지만, 햇볕 아래서 작은 활력이 느껴졌고, 그 순간이 의외로 힘이 되었어요. ‘이런 생기라면 다시 찾고 싶다’는 마음이 자연스럽게 올라왔어요.
            그 말은 낯설지 않았고, 오히려 내가 오래 잊고 있었던 감각처럼 느껴졌어요. “나는 이렇게 살아 있는 느낌을 느낄 수 있는 사람이야.” 그 말이 오늘 하루를 지탱해주는 말이 되었어요.
            오늘의 나는, 내 안에서 올라온 건강한 목소리를 조용히 따라가며 나를 지지하고 있었어요.
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
            
            [Step5 답변 - 감정을 이끈 속마음]
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
            - growth: 성장과 발전과 관련된 감정 (학습, 도전, 진로)
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

    // 자기공감 저장 및 Report 생성
    public ResponseDTO<?> saveSelfEmpathy(SelfEmpathyDTO.selfEmpathyRequestDTO request) {
        // SelfEmpathy 저장
        SelfEmpathy selfEmpathy = new SelfEmpathy();
        selfEmpathy.setOneQuestion(request.getOneQuestion());
        selfEmpathy.setOneAnswer(request.getOneAnswer());
        selfEmpathy.setTwoQuestion(request.getTwoQuestion());
        selfEmpathy.setTwoAnswer(request.getTwoAnswer());
        selfEmpathy.setThreeQuestion(request.getThreeQuestion());
        selfEmpathy.setThreeAnswer(request.getThreeAnswer());
        selfEmpathy.setFourQuestion(request.getFourQuestion());
        selfEmpathy.setFourAnswer(request.getFourAnswer());
        selfEmpathy.setFiveQuestion(request.getFiveQuestion());
        selfEmpathy.setFiveAnswer(request.getFiveAnswer());
        selfEmpathy.setSummary(request.getSummary());
        selfEmpathy.setCategory(request.getCategory());
        selfEmpathy.setEmotion(request.getEmotion());

        SelfEmpathy savedSelfEmpathy = selfEmpathyRepository.save(selfEmpathy);

        // Report 생성 (자기공감만으로도 생성)
        Report report = new Report();
        report.setSelfEmpathy(savedSelfEmpathy);
        // category에 따른 island 값 설정
        Integer islandValue = getIslandValueByCategory(request.getCategory());
        report.setIsland(islandValue);

        Report savedReport = reportRepository.save(report);

        SelfEmpathyDTO.selfEmpathyResponseDTO responseDto;
        responseDto = new SelfEmpathyDTO.selfEmpathyResponseDTO(
                savedSelfEmpathy.getSelfempathyId(),
                savedReport.getReportId(),
                "자기공감이 성공적으로 저장되었습니다.",
                savedSelfEmpathy.getCategory(),
                islandValue
        );

        return ResponseDTO.success("자기공감 등록 완료", responseDto);
    }

    // category에 따른 island 값 반환 메서드
    private Integer getIslandValueByCategory(String category) {
        if (category == null) {
            return 1; // 기본값
        }

        switch (category.toLowerCase()) {
            case "self":
                return 1;
            case "growth":
                return 2;
            case "routine":
                return 3;
            case "relationship":
                return 4;
            default:
                return 1; // 기본값 (self)
        }
    }
}
