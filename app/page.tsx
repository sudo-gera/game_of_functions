"use client"
import {
  CheckSquareOutlined,
  CloseSquareOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Input, Layout, Menu, Space, Table, TableProps, Tag } from 'antd';
import Search from 'antd/es/transfer/search';
import Title from 'antd/es/typography/Title';
import Head from 'next/head';
import React, { useCallback, useState } from 'react';
const { Header, Sider, Content } = Layout;

interface FuncCase {
  key: number;
  output: number;
  your_output?: number;
  visible_output?: number;
}

interface Task {
  key: string;
  cases: FuncCase[];
  solved: boolean;
  func: string;
  text: string;
}

const columns = [
  {
    title: 'input',
    dataIndex: 'key',
    key: 'input',
  },
  {
    title: 'correct output',
    dataIndex: 'output',
    key: 'output',
  },
  {
    title: 'your output',
    dataIndex: 'visible_output',
    key: 'visible_output',
  },
];

const const_tasks: Map<string, Task> = new Map<string, Task>([
  ['welcome', {
    key: 'welcome',
    cases: [
      {key: 1,output: 2,},
      {key: 2,output: 3,},
      {key: 3,output: 4,},
      {key: 4,output: 5,},
    ],
    solved: false,
    func: '',
    text: 'Welcome to the Game of Functions! Your task is simple: create a function that for given inputs produces given outputs. To solve this task, just type x+1!',
  }],
  ['multiplication', {
    key: 'multiplication',
    cases: [
      {key: 1,output: 2,},
      {key: 2,output: 4,},
      {key: 3,output: 6,},
      {key: 4,output: 8,},
    ],
    solved: false,
    func: '',
    text: 'Well done! Now what about some multiplication? Use * symbol to multiply numbers.',
  }],
  ['odd', {
    key: 'odd',
    cases: [
      {key: 1,output: 1,},
      {key: 2,output: 0,},
      {key: 3,output: 1,},
      {key: 4,output: 0,},
    ],
    solved: false,
    func: '',
    text: 'Great! Your next mission is to spot odd numbers. The % symbol will help you.',
  }],
  ['even', {
    key: 'even',
    cases: [
      {key: 1,output: 0,},
      {key: 2,output: 1,},
      {key: 3,output: 0,},
      {key: 4,output: 1,},
    ],
    solved: false,
    func: '',
    text: 'What about spotting even numbers? You have to use both - and % symbols.',
  }],
  ['basic_division', {
    key: 'basic_division',
    cases: [
      {key: 24,output: 1,},
      {key: 12,output: 2,},
      {key: 6,output: 4,},
      {key: 8,output: 3,},
    ],
    solved: false,
    func: '',
    text: 'Division time!',
  }],
  ['square', {
    key: 'square',
    cases: [
      {key: 1,output: 4,},
      {key: 2,output: 1,},
      {key: 3,output: 0,},
      {key: 4,output: 1,},
      {key: 5,output: 4,},
    ],
    solved: false,
    func: '',
    text: 'How to build a square using multiplication, substraction and parentheses?',
  }],
  ['floor', {
    key: 'floor',
    cases: [
      {key: 4.1,output: 4,},
      {key: 3.8,output: 3,},
      {key: 3.2,output: 3,},
      {key: 2.9,output: 2,},
      {key: 2.4,output: 2,},
      {key: 1.9,output: 1,},
      {key: 1.3,output: 1,},
      {key: 0.7,output: 0,},
    ],
    solved: false,
    func: '',
    text: 'Get down on the Math.floor(x)!',
  }],
  ['select_simple', {
    key: 'select_simple',
    cases: [
      {key: 1, output: 1,},
      {key: 2, output: 0,},
      {key: 3, output: 0,},
      {key: 4, output: 0,},
    ],
    solved: false,
    func: '',
    text: 'Floor division can help to select one value to work with',
  }],
  ['select_squared', {
    key: 'select_squared',
    cases: [
      {key: 1, output: 0,},
      {key: 2, output: 0,},
      {key: 3, output: 1,},
      {key: 4, output: 0,},
      {key: 5, output: 0,},
    ],
    solved: false,
    func: '',
    text: 'Substract something -> square -> add one -> divide -> floor -> you\'re awesome! Parentheses would help you!',
  }],
  ['linear_combination', {
    key: 'linear_combination',
    cases: [
      {key: 1, output: 0,},
      {key: 2, output: 0,},
      {key: 3, output: 2,},
      {key: 4, output: 0,},
      {key: 5, output: 3,},
      {key: 6, output: 0,},
      {key: 7, output: 0,},
    ],
    solved: false,
    func: '',
    text: 'May the linear combination be with you!',
  }],
  ['random', {
    key: 'random',
    cases: [
      {key: 19, output: -17,},
      {key: -4, output: -4,},
      {key: -16, output: -12,},
      {key: -9, output: -2,},
    ],
    solved: false,
    func: '',
    text: 'Feeling powerful?',
  }],
]);

function map_to_array<K,V>(a: Map<K, V>){
  let b : [K,V][] = [];
  a.forEach((val, key)=>{
    b.push([key, val]);
  })
  return b;
};


export default function Home() {
  const calculate_task_properties = (task: Task)=>{
    task.solved = task.cases.filter(task_case=>{
      task_case.your_output = NaN;
      try{
        const func = eval('(x) => {return (' + task.func + ');}');
        task_case.your_output = func(task_case.key);
      }catch(e){}
      if (typeof JSON.parse(JSON.stringify(task_case.your_output) || 'null') == 'number'){
        task_case.your_output = Math.round((task_case.your_output as number)*1_000_000)/1_000_000;
        task_case.visible_output = task_case.your_output;
      }
      return task_case.output != task_case.your_output
    }).length == 0;
  };

  const [is_local_storage_loaded, set_is_local_storage_loaded] = useState(false);
  const [tasks, set_tasks] = useState(const_tasks);
  if (!is_local_storage_loaded){
    setTimeout(() => {
      let user_tasks = new Map<string, Task>();
      try{
        user_tasks = new Map<string, Task>(JSON.parse(localStorage.getItem('functions') || '[]'))
      }catch(e){}
      const_tasks.forEach((task, key)=>{
        if (task.key !== key){
          alert(task.key + ' is not equal to ' + key);
        }
      })
      user_tasks.forEach((user_task, key)=>{
        const task = const_tasks.get(key);
        if (typeof task !== 'undefined'){
          task.solved = user_task.solved;
          task.func = user_task.func;
        }
      })
      set_tasks(const_tasks);
      set_is_local_storage_loaded(true);
    }, 10);
  }
  const [current_task, set_current_task] = useState(map_to_array(tasks)[0][1]);
  const update = useCallback(
    () => {
      calculate_task_properties(current_task);
      tasks.set(current_task.key, current_task);
      localStorage.setItem('functions', JSON.stringify(map_to_array(tasks)));
      set_current_task(JSON.parse(JSON.stringify(current_task)));
      set_tasks(new Map<string, Task>(map_to_array(tasks)));
    }, [calculate_task_properties, current_task]
  )
  const on_input_change = useCallback(
    (q: React.ChangeEvent<HTMLInputElement>)=>{
      current_task.func = q.target.value;
      update();
    }, [update, current_task]
  );
  const [collapsed, setCollapsed] = useState(false);
  return (
      <Layout className="layout">
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="logo" >
            <div className="center" >
              Game of functions
            </div>
          </div>
          <Menu
              theme="dark"
              mode="inline"
              items={
                map_to_array(tasks).map(kt=>{
                  const task = kt[1];
                  return {
                    key: task.key,
                    label: task.key,
                    icon: task.solved?<CheckSquareOutlined />:<CloseSquareOutlined />,
                  };
                })
              }
              onClick={(e)=>{set_current_task(tasks.get(e.key)||current_task)}}
          />
        </Sider>
        <Layout className="site-layout">
          <Header
              className="site-layout-background"
              style={{
                padding: 0,
              }}
          >
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed),
            })}
          </Header>
          <Content
              className="site-layout-background"
              style={{
                margin: '24px 16px',
                padding: 24,
              }}
          >
            <Table style={{border: 'solid 4px', borderRadius: '8px', borderColor: current_task.solved?'#00FF00':'#FF0000'}} columns={columns} dataSource={current_task.cases} pagination={false} />
            <Input style={{paddingTop: '20px', paddingBottom: '60px'}} addonBefore="f(x)=" value={current_task.func} onChange={on_input_change}/>
            <Title level={3}>{current_task.text}</Title>
          </Content>
        </Layout>
      </Layout>
  )
}
