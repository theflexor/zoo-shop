import { Col, Row, Typography, Image } from 'antd'
import './paper.scss'

const { Title, Text, Paragraph } = Typography
const arr: number[] = [1,2,3]

export const Paper = () => {
  return (
    <div className='paper'>
      <Title className='paper__title'>Статьи о животных</Title>
      <Row className='paper__start'>
        <Col>
          <div>
            <Text>Зачем делать прививки собакам</Text>
            <Paragraph>Вакцинация для собак – это самый эффективный способ предупреждения опасных заболеваний, часто имеющих серьезные осложнения, в том числе летальный исход. Прививка способствует выработке в организме животного антител, формирующих иммунный ответ. Приобретенная защита дает активную устойчивость к болезням на один год или несколько лет, в зависимости от используемой вакцины.
            </Paragraph>
          </div>
          <div>
            <Text>Правила вакцинации собак</Text>
            <Paragraph>
            До 1.5 месяцев в организме щенков сохраняются защитные антитела, полученные из молока матери. Постепенно естественная иммунная защита начинает слабеть, поэтому возникает необходимость в вакцинации, формирующей искусственную защиту организма от разного рода инфекций.
Собак вакцинируют по прививочному календарю, начиная с двухмесячного возраста. Прививки делаются по определенным правилам. Перед процедурой собаку нужно правильно подготовить, что позволит исключить побочные эффекты и другие нежелательные последствия вакцинации.
            </Paragraph>
          </div>
        </Col>
        <Col>
          <Image
            preview={false}
            src='https://www.proplan.ru/sites/owners.proplan.ru/files/styles/article720x340/public/2020-03/shutterstock_155382377_2.jpg?itok=EBJQe5gN'
            />
        </Col>
      </Row>
      <Row className='paper__main'>
        <Text>Как подготовить собаку к процедуре</Text>
        <Paragraph>Владелец должен наблюдать за состоянием собаки, обеспечить полноценное питание и контролировать стул. В случае выявления определенных признаков заболеваемости следует обратиться к ветеринару и детально разъяснить, какие признаки вызывают подозрения. Врач проведет контрольный осмотр, при необходимости возьмет анализы. Если подтвердится нездоровое состояние животного, вакцинация будет перенесена до полного выздоровления собаки.</Paragraph>
        <Text>Подготовка собаки:</Text>
        <ol>
          {
            arr.map(item => {
              return (
                <li key={item}>
                Исключить на несколько дней до процедуры контакты с другими животными.
                </li>
              )
            })
          }
        </ol>
      </Row>
      <Row className='paper__footer'>
        <Text>Уход за питомцем после прививки</Text>
        <Paragraph>После вакцинации необходимо соблюдать некоторые рекомендации специалистов по уходу.</Paragraph>
        <Text>Что нужно делать:</Text>
        <ol>
          {
            arr.map((item, index) => {
              return (
                <li key={item}>
                <span>{index + 1}. </span>Исключить на несколько дней до процедуры контакты с другими животными.
                </li>
              )
            })
          }
        </ol>
        <Paragraph>Детальные рекомендации по уходу за собакой после процедуры иммунизации выдает лечащий ветеринар.
        </Paragraph>
      </Row>
    </div>
    
  )
}

