import { Image, Layout, List, Row, Space, Typography } from 'antd'
import { Content } from 'antd/es/layout/layout'
import Sider from 'antd/es/layout/Sider'
import { Formik } from 'formik'
import { Form, Input } from 'formik-antd'
import { easeOut, motion } from 'framer-motion'
import moment from 'moment'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Moment from 'react-moment'
import { useMediaQuery } from 'react-responsive'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useTypedSelector } from 'src/hooks'

import { LeftOutlined } from '@ant-design/icons'

import 'moment/locale/ru'

import SendIcon from '../../../public/chat/send.svg'
import { ChatApi, getChatsProps } from '../../api/Chat'

import './chat.scss'

type AnnounType = {
  author: string
  photo: string
  price: string
  slug: string
  title: string
}
type Message = {
  date: string
  id: string
  name: string
  text: string
  ['user image']: string
}

export const Chat = () => {
  const params = useLocation()

  const id = useTypedSelector((state) => state.auth.userInfo?.id)
  const [currentChat, setCurrentChat] = useState<getChatsProps | null>(null)
  const [currentAnnoun, setCurrentAnnoun] = useState<AnnounType>()
  const [value, setValue] = useState<string>('')
  const [chats, setChats] = useState<getChatsProps[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [viewChat, setViewChat] = useState<boolean>(true)
  const [ws, setWs] = useState<WebSocket | null>(null)
  const mobileScreen = useMediaQuery({ query: '(max-width: 768px)' })
  const scrollBar = useRef<HTMLUListElement>(null)

  const changeChat = (user: getChatsProps) => {
    if (ws) {
      ws.close()
      setMessages([])
    }
    setWs(new WebSocket(`wss://zoointer.net/ws/chat/${user.customer}_${user.announcement}/`))
    setCurrentChat(user)
  }

  if (ws) {
    ws.onmessage = async (event) => {
      const data = JSON.parse(event.data)
      if (data.announcement) {
        setCurrentAnnoun(data.announcement as AnnounType)
      }
      const chats = await ChatApi.getChats()
      //eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      setMessages([...messages!, ...data.messages])
      if (scrollBar.current) {
        // console.log(scrollBar.sc);
      }
      if (chats) {
        setChats(chats?.data)
      }
    }
    ws.onclose = (ev) => {
      // setTimeout(() => {
      //   if (currentChat) {
      //     setWs(
      //       new WebSocket(
      //         `wss://enactusanimals.com/ws/chat/${currentChat.customer}_${currentChat.announcement}/`,
      //       ),
      //     )
      //   }
      // }, 1000)
    }
  }
  useEffect(() => {
    if (params?.state?.anoun) {
      setCurrentChat({
        announcement: params.state.anoun,
        customer: params.state.id,
        photo: params.state.photo,
        other_name: params.state.name,
      })
      setViewChat(false)
      setWs(new WebSocket(`wss://zoointer.net/ws/chat/${id}_${params.state.anoun}/`))
      return
    }
  }, [])

  useEffect(() => {
    const getDataChats = async () => {
      const data = await ChatApi.getChats()
      if (data) {
        setChats(data?.data)
      }
      return
    }

    setTimeout(() => {
      getDataChats()
    }, 700)

    return () => {
      ws?.close()
    }
  }, [ws])

  const userChat = 'true'
  const handleInput = (e: { input: string }) => {
    console.log(e)

    if (ws) {
      ws.send(
        JSON.stringify({
          message: e.input,
          author_id: id,
          // seller_id: '3',
        }),
      )
    }
  }
  const scrollBottom = (e: HTMLUListElement) => {
    if (e) {
      e.scrollTop = e.scrollHeight
    }
  }

  useEffect(() => {
    if (!mobileScreen) {
      setViewChat(true)
    }
  }, [mobileScreen])
  return (
    <Layout className="chat">
      <Sider
        width={mobileScreen ? '100%' : ''}
        style={{ left: viewChat ? '0' : '-100%' }}
        className="chat-sidebar"
      >
        <List className="chat-sidebar_user">
          {chats.map((user, index) => (
            <List.Item
              key={index}
              onClick={() => {
                changeChat(user)
                if (mobileScreen) {
                  setViewChat(false)
                }
              }}
              className="sidebar_user_item"
            >
              <Row style={{ gap: '10px' }}>
                <Image
                  className="sidebar_user_item_image"
                  preview={false}
                  height={40}
                  width={40}
                  src={user.photo ? user.photo : '/dogg.jpg'}
                />
                <div className="sidebar_user_item_info">
                  <Typography.Title className="sidebar_user_item_info_name">
                    {user.other_name}
                  </Typography.Title>
                  <Typography.Text className="sidebar_user_item_info_status">
                    {user.last_message ? user.last_message.content : ''}
                  </Typography.Text>
                </div>
              </Row>
              <div>
                <span className="sidebar_user_item_info_status">
                  {moment(user.last_message?.date).utcOffset('+1200').format('LL')}
                </span>
              </div>
            </List.Item>
          ))}
        </List>
      </Sider>
      <Content
        className="chat_content"
        style={{ width: '100%', display: 'flex', flexDirection: 'column' }}
      >
        {currentChat ? (
          <>
            <Row justify="space-between" className="chat_header">
              <Row>
                <Row style={{ display: mobileScreen ? 'flex' : 'none' }}>
                  <LeftOutlined
                    onClick={() => setViewChat(true)}
                    style={{ fontSize: '24px' }}
                  />
                </Row>
                <div className="sidebar_user_item">
                  <Image
                    className="sidebar_user_item_image"
                    preview={false}
                    height={46}
                    width={46}
                    src={currentChat.photo ? currentChat.photo : '/dogg.jpg'}
                  />
                  <div className="sidebar_user_item_info">
                    <Typography.Title className="sidebar_user_item_info_name">
                      {currentChat.other_name ? currentChat.other_name : 'gost'}
                    </Typography.Title>
                  </div>
                </div>
              </Row>

              <Link to={`/announcement/${currentAnnoun?.slug}`}>
                <div className="sidebar_user_item">
                  <Image
                    className="sidebar_user_item_image image-card"
                    preview={false}
                    height={45}
                    width={45}
                    src={currentAnnoun?.photo ? currentAnnoun.photo : '/dog.png'}
                  />
                  <div className="sidebar_user_item_info">
                    <Typography.Text className="sidebar_user_item_info_status2">
                      {mobileScreen
                        ? `${currentAnnoun?.title.slice(0, 10)}...`
                        : `${
                            currentAnnoun?.title && currentAnnoun?.title.length > 35
                              ? currentAnnoun?.title.slice(0, 35)
                              : currentAnnoun?.title
                          }`}
                    </Typography.Text>
                    <Typography.Title className="sidebar_user_item_info_name2">
                      {currentAnnoun?.price}
                    </Typography.Title>
                  </div>
                </div>
              </Link>
            </Row>
            <ul className="chat_message" ref={scrollBottom}>
              {userChat ? (
                messages &&
                messages.map((value, index) => <ChatMessage {...value} key={index} />)
              ) : (
                <div className="no-chat">Выберите чат</div>
              )}
            </ul>
            <Row className="chat_content_input">
              <Formik
                initialValues={{ input: '' }}
                onSubmit={(e, { resetForm }) => {
                  handleInput(e)
                  resetForm()
                }}
              >
                <Form style={{ width: '100%' }}>
                  <Form.Item name="input" style={{ width: '100%' }}>
                    <Input
                      style={{ width: '100%' }}
                      name="input"
                      suffix={
                        <Image
                          /* onClick={() => handleSubmit()} */
                          style={{ cursor: 'pointer' }}
                          src={SendIcon}
                          preview={false}
                        />
                      }
                    />
                  </Form.Item>
                </Form>
              </Formik>
            </Row>
          </>
        ) : (
          <Row
            justify={'center'}
            align={'middle'}
            style={{ height: '100%', fontSize: 16, color: '#828282' }}
          >
            Выберите чат
          </Row>
        )}
      </Content>
    </Layout>
  )
}
type chatMessage = {
  text: string
  name: string
  id: string
  date: string
}

const ChatMessage = (value: chatMessage) => {
  return (
    <motion.li
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="chat_message_item"
    >
      <Image
        className="chat_message_item_image"
        preview={false}
        height={40}
        width={40}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        src={value.user_image}
      />
      <div className="chat_message_item_info">
        <Typography.Title className="sidebar_user_item_info_name">
          {value.name}
        </Typography.Title>
        <Typography.Text className="chat_message_item_info_status">
          {value.text}
        </Typography.Text>
      </div>
      <div className="chat_message_item_info_status2">
        {/* <span>
          <Image src="/chat/readed.svg" />
          <Image src="/chat/read.svg" />
        </span> */}
        <span>{moment(value.date).utcOffset('+1200').format('HH:mm')}</span>
      </div>
    </motion.li>
  )
}
