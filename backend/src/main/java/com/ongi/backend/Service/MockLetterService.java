package com.ongi.backend.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.ongi.backend.DTO.MockLetterDTO;
import com.ongi.backend.DTO.RealStoryDTO;
import com.ongi.backend.DTO.ResponseDTO;
import com.ongi.backend.Entity.MockLetter;
import com.ongi.backend.Entity.RealStory;
import com.ongi.backend.Entity.Report;
import com.ongi.backend.Entity.SelfEmpathy;
import com.ongi.backend.Repository.MockLetterRepository;
import com.ongi.backend.Repository.RealStoryRepository;
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

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class MockLetterService {
    private final SelfEmpathyRepository selfEmpathyRepository;
    @Value("${openai.api.key}")
    private String apiKey;

    private final String OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final MockLetterRepository mockLetterRepository;
    private final ReportRepository reportRepository;
    private final RealStoryRepository realStoryRepository;

    public String[] generateLetter(
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
            당신은 감정에 섬세하게 공감하고 글을 잘 쓰는 편지 작가입니다.
            아래 사용자가 경험한 감정, 상황, 속마음을 바탕으로 **비슷한 상황에 놓인 사람의 고민을 담은 편지**를 생성해주세요.
                        
            [작성 지침]
            - 편지는 누군가가 무지님에게 보내는 형식입니다.
            - 사용자의 경험 중 긍정적인 요소(예: 기쁨, 성취감 등)가 있더라도, 그 경험과 연관된 고민(예: 불안, 진로 고민, 관계 고민 등)을 포함한 새로운 사연 편지를 작성해주세요.
            - 예를 들어: "멘토와의 대화 속 뿌듯함" → "진로 방향에 대한 불안과 고민"으로 연결
            - 편지 제목과 본문을 반드시 JSON 배열 형식으로 출력하세요.
              - 배열의 첫 번째 요소(인덱스 0)는 제목이어야 하며, “제목: ”이라는 접두어 없이 제목만 작성해주세요.
              - 배열의 두 번째 요소(인덱스 1)는 편지 본문이어야 하며, “내용: ”이라는 접두어 없이 작성해주세요.
            - 본문은 5~6문장 정도의 길이로 자연스럽고 공감 가는 흐름을 가지도록 작성하고, 1인칭 시점(저는 ~해요)으로 작성합니다.
            - 사용자의 경험에서 완전히 벗어나지 않되, 직접적인 복붙이 아닌 비슷한 맥락의 다른 고민처럼 보이도록 변형해서 작성해주세요.
            - 따옴표(")는 사용하지 마세요.
            
            [예시1]
            [
              "자기 계발과 끝없는 업무 속에서, 버텨내는 매일이 너무 힘겹게 느껴져요",
              "무지님, 안녕하세요. 저는 요즘 정말 힘든 시간을 보내고 있습니다. 직장에서는 업무가 끊임없이 늘어나고, 퇴근 후에도 자기 계발을 위한 공부를 해야 하는데 시간이 턱없이 부족해 매일 스트레스로 가득한 나날을 보내고 있어요. 이런 상황에서 어떻게 하면 좋을까요? 무지님은 제 마음을 헤아려주실 수 있을 것 같아요."
            ]   
            
            [예시2]
            [
              "진로 고민과 앞이 보이지 않는 불안함",
              "무지님, 안녕하세요. 저는 요즘 진로에 대한 고민으로 마음이 무거워요. 멘토와의 대화에서 잠시 뿌듯함을 느꼈지만, 여전히 제 길이 맞는지, 잘하고 있는지 걱정이 되곤 해요. 노력하고 있지만 계속 불안함이 가시지 않아 마음이 복잡해요. 이런 마음, 무지님이라면 어떻게 풀어가실까요?"
            ] 
            
            """);

            ObjectNode userMessage = objectMapper.createObjectNode();
            userMessage.put("role", "user");
            userMessage.put("content", String.format("""
            누군가가 오늘 가장 인상깊었던 일에 대해 설명했어요.
            아래는 사용자가 자기 감정을 탐색하면서 작성한 입력이에요:

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
            
            사용자가 경험한 감정, 상황, 속마음을 바탕으로 **비슷한 상황에 놓인 사람의 고민을 담은 편지**를 생성해주세요.
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

            // getResponse를 JSON 배열로 파싱 (응답이 유효한 JSON 배열 형식이라고 가정)
            String[] result = objectMapper.readValue(getResponse, String[].class);
            return result;

        } catch (Exception e) {
            log.error("OpenAI API 호출 중 오류 발생", e);
            throw new RuntimeException("OpenAI API 호출 중 오류 발생", e);
        }
    }

    public String generateFeedback1(
            String step1Answer, String step2Answer, String step3Feelings, String step4Answer,
            String step5Answer, String mockLetter, String letterResponse
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
            당신은 사람들의 감정을 섬세하게 연결하는 감정 코멘터입니다.           
            아래 사용자의 자기공감 기록과, 사연자에게 보낸 편지를 바탕으로 두 사람의 감정이 어떻게 연결되는지를 설명해주세요.
                
            [작성 지침]
            - 무지님이 자기공감에서 어떤 감정을 느꼈는지를 언급해주세요.
            - 사연자와 무지님의 감정이나 경험이 어떤 공통점이 있는지를 자연스럽게 서술해주세요.
            - 마지막 문장은 두 사람이 가진 공통된 정서나 마음을 한 문장으로 따뜻하게 정리해주세요.
            - 총 2~3문장, 너무 길지 않고 부드럽고 섬세한 말투로 작성해주세요.    
            
            [예시 1]
            무지님이 자기공감에서 “시간에 쫓겨서 짜증이 났다”고 말해주셨어요. 사연자도 해야할 일을 버텨내며 스스로 계속 몰아세우고 있었는지 몰라요. 그 짜증과 지침의 바닥엔, 무지님이 너무 열심히 버텨왔다는 흔적이 있었을지도요    
            
            [예시 2]
            무지님이 자기공감에서 친한 친구에게 가장 편한 존재라는 생각이 들었을 때 뿌듯함을 느꼈다고 말해주셨죠. 사연자도 이전에는 좋지 않았던 교우관계가 점점 더 발전해나가며 스스로 뿌듯함을 느낌과 동시에 진짜 잘하고 있는게 맞나 의심이 들고 있는 것 같아요. 그 뿌듯함과 혹은 의심 이면에는, 두 분 모두 더 좋은 사람이 되고싶은 예쁜 마음이 있었을지도 몰라요.
            
            """);

            ObjectNode userMessage = objectMapper.createObjectNode();
            userMessage.put("role", "user");
            userMessage.put("content", String.format("""

            [자기공감 Step1 답변 - 인상깊었던 일]
            %s

            [자기공감 Step2 답변 - 구체적인 상황 설명]  
            %s

            [자기공감 Step3 선택한 감정들]  
            %s
            
            [자기공감 Step4 답변 - 선택했던 감정이 들었던 자세한 속 마음]
            %s
            
            [자기공감 Step5 답변 - 감정을 느꼈던 가장 큰 이유]
            %s
            
            [사연편지]
            %s
            
            [사용자가 사연편지에 대해 작성한 답변 편지]
            %s
            
            """, step1Answer, step2Answer, step3Feelings, step4Answer, step5Answer, mockLetter, letterResponse));

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

    public String[] generateFeedback2(
            String step1Answer, String step2Answer, String step3Feelings, String step4Answer,
            String step5Answer, String mockLetter, String letterResponse
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
            당신은 사람들의 따뜻한 말을 기억하고 되돌려주는 공감의 메신저입니다.
            무지님이 다른 사람에게 써준 편지 속에서 진심이 담긴 공감의 문장을 찾아, 이번에는 그 말을 무지님에게도 다시 들려주세요.
                        
            [작성 지침]
            - 사용자가 사연자에게 써준 편지 중, 진심이 담긴 따뜻한 공감 문장을 한 줄 추출하세요.
            - 해당 문장을 JSON 배열의 첫 번째 요소로 출력합니다. 반드시 큰따옴표 없이 문장만 작성하세요.
            - 두 번째 요소에는, 그 말을 이번에는 사용자 자신에게 들려주는 따뜻한 위로 문장을 작성하세요. 이때, "이번에는 그 말을 자신에게도 들려주세요"라는 말을 꼭 넣어주세요.
            - 말투는 부드럽고 다정하게, 길이는 2~3문장 정도로 해주세요.
            - 전체 응답은 JSON 배열 형식으로 출력합니다. 예시는 다음과 같아요:
               
            [예시 1]
            [
                “조금 쉬어도 괜찮아요”,
                "무지님과 비슷한 마음을 지닌 누군가에게 무지님이 조심스레 건넨 이 한마디처럼, 이번엔 그 말을 자신에게도 들려주세요. “조금 쉬어도 괜찮아요.” 무지님은 정말, 여기까지 열심히 잘 걸어오셨어요."
            ]
                
            [예시 2]
            [
              "당신은 참 좋은 사람이에요",
              "비슷한 마음을 지닌 누군가에게 무지님이 건넨 따듯한 한마디처럼, 이번에는 그 말을 자신에게도 들려주세요. “당신은 참 좋은 사람이에요.” 언제나 타인에게 의지가 되는 사람으로 올바르게 서 가는 당신은, 그 자체로도 충분하고 가치있는 사람이에요."
            ]
            """);

            ObjectNode userMessage = objectMapper.createObjectNode();
            userMessage.put("role", "user");
            userMessage.put("content", String.format("""
            아래는 사용자의 자기공감 기록과, 사연자에게 써준 답장 편지입니다.
            이 중에서 사연자에게 해준 따뜻한 공감 문장을 하나 골라주세요. 그리고 그 말을 무지님 자신에게도 건네주세요.

            [자기공감 Step1 답변 - 인상깊었던 일]
            %s

            [자기공감 Step2 답변 - 구체적인 상황 설명]  
            %s

            [자기공감 Step3 선택한 감정들]  
            %s
            
            [자기공감 Step4 답변 - 선택했던 감정이 들었던 자세한 속 마음]
            %s
            
            [자기공감 Step5 답변 - 감정을 느꼈던 가장 큰 이유]
            %s
            
            [사연편지]
            %s
            
            [사용자가 사연편지에 대해 작성한 답변 편지]
            %s
            
            """, step1Answer, step2Answer, step3Feelings, step4Answer, step5Answer, mockLetter, letterResponse));

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

            // getResponse를 JSON 배열로 파싱 (응답이 유효한 JSON 배열 형식이라고 가정)
            String[] result = objectMapper.readValue(getResponse, String[].class);
            return result;

        } catch (Exception e) {
            log.error("OpenAI API 호출 중 오류 발생", e);
            throw new RuntimeException("OpenAI API 호출 중 오류 발생", e);
        }
    }

    public String[] generateFeedback3(
            String step1Answer, String step2Answer, String step3Feelings, String step4Answer,
            String step5Answer, String mockLetter, String letterResponse
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
            당신은 감정 중심 피드백을 도와주는 따뜻한 조언자입니다.
                        
            아래 사용자의 자기공감 기록과, 사연자에게 보낸 답변 편지를 읽고,
            혹시 공감이 충분하지 않았더라도, 더 감정 중심의 문장으로 바꿀 수 있도록 무조건 피드백을 생성해주세요.
                        
            [작성 지침]
            - 피드백은 반드시 JSON 배열 형식으로 출력합니다.
            - 배열 [0]번에는 요약 피드백 제목을 1문장으로 담아주세요. 예: "칭찬의 공감도 공감이에요!"
            - 배열 [1]번에는 상세 피드백을 담되, 사용자의 문장을 감정 중심으로 어떻게 바꾸면 좋을지 구체적인 조언을 주세요.
            - 해결책, 조언, 분석 중심의 문장을 ‘감정 공감형 표현’으로 바꿔주는 방향의 제안을 포함해주세요.
            - 사용자의 표현이 이미 공감 중심이어도, 그 표현을 더 살릴 수 있는 조언을 추가해주세요.
            - 문장은 부드럽고 친절한 말투로, 책임을 묻거나 강요하지 않게 써주세요.
            - 출력은 반드시 아래 JSON 배열 형식이어야 합니다.
                
            [예시 1]
            [
              "사연자의 감정을 먼저 헤아려 보아요",
              "“누구나 겪는 일이에요”처럼 들릴 수 있는 말보다는 “그 상황, 정말 버거우셨겠어요”처럼 사연자의 감정을 먼저 인정하는 말이 더 오래 기억에 남을 거에요."
            ]
            
            [예시 2]
            [
                "칭찬의 공감도 공감이에요!",    
                "“더 고민하려면~해보세요”처럼 더 발전시킬 수 있는 방법을 제시하는 것도 너무 좋지만, 사연자의 모습을 있는 그대로 칭찬하며 공감한다면, 사연자는 무지님의 말에 더 큰 용기를 얻을 것 같아요."
            ]
            
            [예시 3]
            [
              "이미 좋은 말이에요, 더 따뜻하게 확장해보면 어때요?",
              "“지금도 충분히 잘하고 있어요”라는 말에 공감이 담겨 있었어요. 여기에 사연자의 감정을 더 구체적으로 짚어주면, 위로가 더 잘 전달될 거예요. 예를 들어, ‘그만큼 애써온 시간이 있었기에 흔들릴 수도 있죠’ 같은 말이요."
            ]
            """);

            ObjectNode userMessage = objectMapper.createObjectNode();
            userMessage.put("role", "user");
            userMessage.put("content", String.format("""

            [자기공감 Step1 답변 - 인상깊었던 일]
            %s

            [자기공감 Step2 답변 - 구체적인 상황 설명]  
            %s

            [자기공감 Step3 선택한 감정들]  
            %s
            
            [자기공감 Step4 답변 - 선택했던 감정이 들었던 자세한 속 마음]
            %s
            
            [자기공감 Step5 답변 - 감정을 느꼈던 가장 큰 이유]
            %s
            
            [사연편지]
            %s
            
            [사용자가 사연편지에 대해 작성한 답변 편지]
            %s
            
            """, step1Answer, step2Answer, step3Feelings, step4Answer, step5Answer, mockLetter, letterResponse));

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

            // getResponse를 JSON 배열로 파싱 (응답이 유효한 JSON 배열 형식이라고 가정)
            String[] result = objectMapper.readValue(getResponse, String[].class);
            return result;

        } catch (Exception e) {
            log.error("OpenAI API 호출 중 오류 발생", e);
            throw new RuntimeException("OpenAI API 호출 중 오류 발생", e);
        }
    }

    public String generateFeedback4(
            String step1Answer, String step2Answer, String step3Feelings, String step4Answer,
            String step5Answer, String mockLetter, String letterResponse
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
            당신은 누군가의 다정한 편지에 섬세하고 따뜻한 피드백을 건네는 공감 코멘터입니다.
                        
            아래 사용자의 자기공감 기록과, 사연자에게 쓴 답장 편지를 보고, 그 편지가 전반적으로 어떤 느낌이었는지 따뜻한 말 한 문장으로 정리해 주세요.
                        
            [작성 지침]
            - 말투는 다정하고 섬세하게, 칭찬 혹은 감정 공감이 담기도록 작성해주세요.
            - 문장은 반드시 1문장으로만 작성해주세요.
            - 지나친 분석 없이 느낌 위주로, 따뜻하고 감성적인 표현을 사용해주세요.
            - 문장 끝을 “말이었어요”처럼 부드럽게 마무리해주세요.
            - 사람 이름이나 호칭 등 지칭어(예: 무지님, 당신 등)는 사용하지 마세요.
            - 아래 예시와 같은 형식을 따라주세요.
                
            [예시 1]
            따뜻했고, 다정했고, 무엇보다 스스로에게도 다시 돌아올 수 있는 말이었어요.
            
            [예시 2]    
            따뜻했고, 평안했으며, 스스로의 경험을 투영해서 더 진심어렸어요.  
            
            """);

            ObjectNode userMessage = objectMapper.createObjectNode();
            userMessage.put("role", "user");
            userMessage.put("content", String.format("""

            [자기공감 Step1 답변 - 인상깊었던 일]
            %s

            [자기공감 Step2 답변 - 구체적인 상황 설명]  
            %s

            [자기공감 Step3 선택한 감정들]  
            %s
            
            [자기공감 Step4 답변 - 선택했던 감정이 들었던 자세한 속 마음]
            %s
            
            [자기공감 Step5 답변 - 감정을 느꼈던 가장 큰 이유]
            %s
            
            [사연편지]
            %s
            
            [사용자가 사연편지에 대해 작성한 답변 편지]
            %s
            
            """, step1Answer, step2Answer, step3Feelings, step4Answer, step5Answer, mockLetter, letterResponse));

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

            return getResponse + "\n\n그 마음이 이 여정의 끝에서 더 오래 머물 수 있길 바라요.";

        } catch (Exception e) {
            log.error("OpenAI API 호출 중 오류 발생", e);
            throw new RuntimeException("OpenAI API 호출 중 오류 발생", e);
        }
    }

    // 편지모의쓰기 저장 및 Report 업데이트
    public ResponseDTO<MockLetterDTO.mockLetterResponseDTO> saveMockLetter(MockLetterDTO.mockLetterRequestDTO request) {
        // MockLetter 저장
        MockLetter mockLetter = new MockLetter();
        mockLetter.setUserResponse(request.getUserResponse());
        mockLetter.setFeedback1(request.getFeedback1());
        mockLetter.setFeedback2Title(request.getFeedback2Title());
        mockLetter.setFeedback2Content(request.getFeedback2Content());
        mockLetter.setFeedback3Title(request.getFeedback3Title());
        mockLetter.setFeedback3Content(request.getFeedback3Content());
        mockLetter.setReview(request.getReview()); // 선택사항

        Optional<RealStory> realStory = realStoryRepository.findById(request.getRealstoryId());
        mockLetter.setRealStory(realStory.get());

        MockLetter savedMockLetter = mockLetterRepository.save(mockLetter);

        Optional<SelfEmpathy> selfEmpathy = selfEmpathyRepository.findById(request.getSelfempathyId());
        // 기존 Report 찾아서 업데이트
        Report report = reportRepository.findBySelfEmpathy(selfEmpathy)
                .stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("해당 자기공감에 대한 리포트를 찾을 수 없습니다."));

        report.setMockLetter(savedMockLetter);
        reportRepository.save(report);

        MockLetterDTO.mockLetterResponseDTO responseDTO =
                new MockLetterDTO.mockLetterResponseDTO(
                        savedMockLetter.getMockletterId(),
                        report.getReportId(),
                        "편지모의쓰기가 성공적으로 저장되었습니다.",
                        savedMockLetter.getReview()
                );

        return ResponseDTO.success("편지모의쓰기 등록 완료", responseDTO);
    }
}
