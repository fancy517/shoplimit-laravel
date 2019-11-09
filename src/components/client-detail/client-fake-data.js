export const status = {
  GREEN: 'completed',
  ORANGE: 'active',
  RED: 'not',
  GREY: 'pending'
}

export const homeBuyingStages = [
  'Saved Homes',
  'Toured Homes',
  'Offer Accepted',
  'Routes Scheduled',
  'Feedback Given',
  'Offer Made'
]

export const homeBuyingStageColors = [
  status.GREEN,
  status.GREEN,
  status.GREEN,
  status.ORANGE,
  status.RED,
  status.GREY,
  status.GREY,
  status.GREY
]

export const clientData = [
  {
    id: '1',
    name: 'John Smith',
    email: 'johnanthonysmith@gmail.com',
    phone: '512.835.6851',
    agentId: '1',
    associatedAgents: ['1', '2'],
    availability: true,
    homePreferences: {
      wants: ['Want 1', 'Want 2', 'Want 3'],
      needs: ['Need 1', 'Need 2', 'Need 3']
    },
    homes: ['1', '2', '3'],
    propertiesOfInterest: ['1', '2', '3'],
    viewings: [
      {
        propertyId: '1',
        workflowState: 'viewed',
        scheduled: null,
        completed: false,
        timestamp: '',
        addedById: '1',
        feedback: ['The house meets move of my requirements'],
        canChange: true
      },
      { propertyId: '2', workflowState: 'viewed' },
      { propertyId: '3', workflowState: 'viewed' }
    ],
    buyer_number: '12345',
    home_buying_stage: [status.GREEN, status.GREEN, status.GREEN, status.ORANGE, status.RED, status.GREY, status.GREY, status.GREY],
    last_active: '10.23.18',
    wants: ['Want 1', 'Want 2', 'Want 3'],
    needs: ['Need 1', 'Need 2', 'Need 3'],
    saved_homes: [
      {
        id: '1',
        address: '598 Main street, Austin, TX',
        date_requested: '12.03.2018',
        date_added: '10.23.18',
        pics: true,
        viewed: {
          status: true,
          last_viewed: '10.23.18',
          needs: 100,
          wants: 100
        },
        wants: ['Want 1', 'Want 2', 'Want 3', 'Want 4', 'Want 5'],
        needs: ['Need 1', 'Need 2', 'Need 3'],
        feedback: 'provided'
      },
      {
        id: '2',
        address: '6709 Ducesne, Austin, TX',
        date_requested: '09.05.18',
        date_added: '09.05.18',
        pics: false,
        viewed: {
          status: true,
          last_viewed: '09.05.18',
          needs: 80,
          wants: 70
        },
        wants: ['Want 1', 'Want 2', 'Want 3'],
        needs: ['Need 1', 'Need 2', 'Need 3'],
        feedback: 'pending'
      },
      {
        id: '3',
        address: '2210 Shelby Shirley Avenue, Austin, TX',
        date_requested: '12.11.18',
        date_added: '12.10.18',
        pics: false,
        viewed: {
          status: true,
          last_viewed: '15.11.18',
          needs: 75,
          wants: 100
        },
        wants: ['Want 1', 'Want 3'],
        needs: ['Need 1', 'Need 2', 'Need 3', 'Need 4'],
        feedback: 'pending'
      }
    ],
    route_details: [
      {
        id: '1',
        name: 'Route 1',
        home_address: [
          {
            id: '1',
            home_id: '5c8ca7cc63e3dab61fd8682d',
            time: '2019-03-12T13:59:08.062Z',
            status: 'confirmed'
          },
          {
            id: '2',
            home_id: '5c821b8d63e3dab61fc568bd',
            time: '2019-03-17T03:59:08.062Z',
            status: 'pending'
          },
          {
            id: '3',
            home_id: '5cb03eba7bbfa41148e47263',
            time: '2019-03-20T11:05:04.062Z',
            status: 'confirmed'
          }
        ],
        timestamp: 'Tuesday 12.24.19, 2:00 PM',
        status: 'SAVED'
      },
      {
        id: '2',
        name: 'Route 2',
        home_address: [
          {
            home_id: '5c8ca7cc63e3dab61fd8682d',
            time: '2019-03-17T03:59:08.062Z',
            status: 'confirmed'
          },
          {
            home_id: '5c821b8d63e3dab61fc568bd',
            time: '2019-03-17T03:59:08.062Z',
            status: 'confirmed'
          },
          {
            home_id: '5cb03eba7bbfa41148e47263',
            time: '2019-03-17T05:22:18.062Z',
            status: 'pending'
          }
        ],
        timestamp: 'Tuesday 12.24.19, 2:00 PM',
        status: 'SAVED'
      },
      {
        id: '3',
        name: 'Route 3',
        home_address: [
          {
            home_id: '5c8ca7cc63e3dab61fd8682d',
            time: '2019-03-10T14:56:44.062Z',
            status: 'confirmed'
          },
          {
            home_id: '5c821b8d63e3dab61fc568bd',
            time: '2019-03-17T03:59:08.062Z',
            status: 'confirmed'
          },
          {
            home_id: '5cb03eba7bbfa41148e47263',
            time: '2019-03-14T22:45:18.062Z',
            status: 'confirmed'
          }
        ],
        timestamp: 'Tuesday 12.24.19, 2:00 PM',
        status: 'CONFIRMED'
      },
      {
        id: '4',
        name: 'Route 4',
        home_address: [
          {
            home_id: '5c8ca7cc63e3dab61fd8682d',
            time: '2019-03-17T03:59:08.062Z',
            status: 'confirmed'
          },
          {
            home_id: '5c821b8d63e3dab61fc568bd',
            time: '2019-02-09T23:19:18.162Z',
            status: 'confirmed'
          },
          {
            home_id: '5cb03eba7bbfa41148e47263',
            time: '2019-03-17T03:59:08.062Z',
            status: 'confirmed'
          }
        ],
        timestamp: 'Tuesday 12.24.19, 2:00 PM',
        status: 'SCHEDULED'
      },
      {
        id: '5',
        name: 'Route 5',
        home_address: [
          {
            home_id: '5c8ca7cc63e3dab61fd8682d',
            time: '2019-03-17T03:59:08.062Z',
            status: 'confirmed'
          },
          {
            home_id: '5c821b8d63e3dab61fc568bd',
            time: '2019-03-17T03:59:08.062Z',
            status: 'confirmed'
          },
          {
            home_id: '5cb03eba7bbfa41148e47263',
            time: '2019-03-17T03:59:08.062Z',
            status: 'confirmed'
          }
        ],
        timestamp: 'Tuesday 12.24.19, 2:00 PM',
        status: 'COMPLETED'
      },
      {
        id: '6',
        name: 'Route 6',
        home_address: [
          {
            home_id: '5c821b8d63e3dab61fc568bd',
            time: '2019-03-17T03:59:08.062Z',
            status: 'pending'
          },
          {
            home_id: '5c8ca7cc63e3dab61fd8682d',
            time: '2019-03-17T03:59:08.062Z',
            status: 'confirmed'
          },
          {
            home_id: '5cb03eba7bbfa41148e47263',
            time: '2019-03-17T03:59:08.062Z',
            status: 'confirmed'
          }
        ],
        timestamp: 'Tuesday 12.21.18, 5:00 PM',
        status: 'PENDING'
      },
      {
        id: '7',
        name: 'Route 7',
        home_address: [
          {
            home_id: '5c821b8d63e3dab61fc568bd',
            time: '2019-03-17T03:59:08.062Z',
            status: 'confirmed'
          },
          {
            home_id: '5cb03eba7bbfa41148e47263',
            time: '2019-03-17T03:59:08.062Z',
            status: 'confirmed'
          }
        ],
        timestamp: 'Tuesday 12.24.19, 2:00 PM',
        status: 'SCHEDULED'
      }
    ],
    messages: [
      {
        date: '09/01',
        subject: 'What time is good to look at West House?',
        read: false,
        type: 'text',
        content:
          'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nostrum iusto odit tempore alias quisquam labore beatae veritatis laudantium animi, recusandae ab. Quasi iure explicabo ullam incidunt! Reprehenderit architecto ad labore quis dolorum distinctio quisquam non quos nam, nesciunt dolorem molestiae!'
      },
      {
        date: '08/01',
        subject: 'Urgently',
        read: true,
        type: 'email'
      },
      {
        date: '07/01',
        subject: 'WEST HOME',
        read: true,
        type: 'text'
      },
      {
        date: '06/01',
        subject: 'New Offer',
        read: true,
        type: 'email'
      },
      {
        date: '05/01',
        subject: 'WEST HOME',
        read: true,
        type: 'text'
      }
    ],
    schedules: [
      {
        date: '09/01',
        day: 'Monday',
        time: '2:30pm'
      },
      {
        date: '09/01',
        day: 'Monday',
        time: '2:30pm'
      },
      {
        date: '09/01',
        day: 'Monday',
        time: '2:30pm'
      },
      {
        date: '09/01',
        day: 'Monday',
        time: '2:30pm'
      },
      {
        date: '09/01',
        day: 'Monday',
        time: '2:30pm'
      }
    ]
  },
  {
    id: '2',
    name: 'Test Name',
    email: 'sometest@test.com',
    phone: '999 999 9999',
    agentId: '1',
    associatedAgents: ['1', '2'],
    availability: true,
    homePreferences: {
      wants: ['Want 1', 'Want 4'],
      needs: ['Need 2', 'Need 4', 'Need 5']
    },
    propertiesOfInterest: ['2', '3'],
    homes: ['2', '3'],
    viewings: ['2', '3'],
    feedback: [
      {
        parent: '2',
        list: [
          'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nostrum iusto odit tempore alias quisquam labore beatae veritatis laudantium animi, recusandae ab.'
        ]
      }
    ],
    activeViewings: ['']
  }
]

export const sampleClient = {
  id: '1',
  name: 'John Smith',
  email: 'johnanthonysmith@gmail.com',
  phone: 'phone: 512.835.6851',
  buyer_number: '12345',
  home_buying_stage: [status.GREEN, status.GREEN, status.GREEN, status.ORANGE, status.RED, status.GREY],
  last_active: '10.23.18',
  wants: ['Want 1', 'Want 2', 'Want 3'],
  needs: ['Need 1', 'Need 2', 'Need 3'],
  saved_homes: [
    {
      id: '1',
      address: '598 Main street, Austin, TX',
      date_requested: '12.03.2018',
      date_added: '10.23.18',
      pics: true,
      viewed: {
        status: true,
        last_viewed: '10.23.18',
        needs: 100,
        wants: 100
      },
      wants: ['Want 1', 'Want 2', 'Want 3', 'Want 4', 'Want 5'],
      needs: ['Need 1', 'Need 2', 'Need 3'],
      feedback: 'provided'
    },
    {
      id: '2',
      address: '6709 Ducesne, Austin, TX',
      date_requested: '09.05.18',
      date_added: '09.05.18',
      pics: false,
      viewed: {
        status: true,
        last_viewed: '09.05.18',
        needs: 80,
        wants: 70
      },
      wants: ['Want 1', 'Want 2', 'Want 3'],
      needs: ['Need 1', 'Need 2', 'Need 3'],
      feedback: 'pending'
    },
    {
      id: '3',
      address: '2210 Shelby Shirley Avenue, Austin, TX',
      date_requested: '12.11.18',
      date_added: '12.10.18',
      pics: false,
      viewed: {
        status: true,
        last_viewed: '15.11.18',
        needs: 75,
        wants: 100
      },
      wants: ['Want 1', 'Want 3'],
      needs: ['Need 1', 'Need 2', 'Need 3', 'Need 4'],
      feedback: 'pending'
    }
  ],
  route_details: [
    {
      id: '1',
      name: 'Route 1',
      home_address: [
        {
          id: '1',
          home_id: '1',
          time: '2:00 PM',
          status: 'confirmed'
        },
        {
          id: '2',
          home_id: '5c821b8d63e3dab61fc568bd',
          time: '2:30 PM',
          status: 'pending'
        },
        {
          id: '3',
          home_id: '5cb03eba7bbfa41148e47263',
          time: '2:00 PM',
          status: 'confirmed'
        }
      ],
      timestamp: 'Tuesday 12.24.19, 2:00 PM',
      status: 'SAVED'
    },
    {
      id: '2',
      name: 'Route 2',
      home_address: [
        {
          home_id: '1',
          time: '2:00 PM',
          status: 'confirmed'
        },
        {
          home_id: '5c821b8d63e3dab61fc568bd',
          time: '2:30 PM',
          status: 'confirmed'
        },
        {
          home_id: '5cb03eba7bbfa41148e47263',
          time: '2:00 PM',
          status: 'pending'
        }
      ],
      timestamp: 'Tuesday 12.24.19, 2:00 PM',
      status: 'SAVED'
    },
    {
      id: '3',
      name: 'Route 3',
      home_address: [
        {
          home_id: '1',
          time: '2:00 PM',
          status: 'confirmed'
        },
        {
          home_id: '5c821b8d63e3dab61fc568bd',
          time: '2:30 PM',
          status: 'confirmed'
        },
        {
          home_id: '5cb03eba7bbfa41148e47263',
          time: '2:00 PM',
          status: 'confirmed'
        }
      ],
      timestamp: 'Tuesday 12.24.19, 2:00 PM',
      status: 'CONFIRMED'
    },
    {
      id: '4',
      name: 'Route 4',
      home_address: [
        {
          home_id: '1',
          time: '2:00 PM',
          status: 'confirmed'
        },
        {
          home_id: '5c821b8d63e3dab61fc568bd',
          time: '2:30 PM',
          status: 'confirmed'
        },
        {
          home_id: '5cb03eba7bbfa41148e47263',
          time: '2:00 PM',
          status: 'confirmed'
        }
      ],
      timestamp: 'Tuesday 12.24.19, 2:00 PM',
      status: 'SCHEDULED'
    },
    {
      id: '5',
      name: 'Route 5',
      home_address: [
        {
          home_id: '1',
          time: '2:00 PM',
          status: 'confirmed'
        },
        {
          home_id: '5c821b8d63e3dab61fc568bd',
          time: '2:30 PM',
          status: 'confirmed'
        },
        {
          home_id: '5cb03eba7bbfa41148e47263',
          time: '2:00 PM',
          status: 'confirmed'
        }
      ],
      timestamp: 'Tuesday 12.24.19, 2:00 PM',
      status: 'COMPLETED'
    },
    {
      id: '6',
      name: 'Route 6',
      home_address: [
        {
          home_id: '5c821b8d63e3dab61fc568bd',
          time: '2:00 PM',
          status: 'pending'
        },
        {
          home_id: '1',
          time: '3:30 PM',
          status: 'confirmed'
        },
        {
          home_id: '5cb03eba7bbfa41148e47263',
          time: '5:00 PM',
          status: 'confirmed'
        }
      ],
      timestamp: 'Tuesday 12.21.18, 5:00 PM',
      status: 'PENDING'
    },
    {
      id: '7',
      name: 'Route 7',
      home_address: [
        {
          home_id: '5c821b8d63e3dab61fc568bd',
          time: '2:00 PM',
          status: 'confirmed'
        },
        {
          home_id: '5cb03eba7bbfa41148e47263',
          time: '2:30 PM',
          status: 'confirmed'
        }
      ],
      timestamp: 'Tuesday 12.24.19, 2:00 PM',
      status: 'SCHEDULED'
    }
  ],
  messages: [
    {
      date: '09/01',
      subject: 'What time is good to look at West House?',
      read: false,
      type: 'text',
      content:
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nostrum iusto odit tempore alias quisquam labore beatae veritatis laudantium animi, recusandae ab. Quasi iure explicabo ullam incidunt! Reprehenderit architecto ad labore quis dolorum distinctio quisquam non quos nam, nesciunt dolorem molestiae!'
    },
    {
      date: '08/01',
      subject: 'Urgently',
      read: true,
      type: 'email'
    },
    {
      date: '07/01',
      subject: 'WEST HOME',
      read: true,
      type: 'text'
    },
    {
      date: '06/01',
      subject: 'New Offer',
      read: true,
      type: 'email'
    },
    {
      date: '05/01',
      subject: 'WEST HOME',
      read: true,
      type: 'text'
    }
  ],
  schedules: [
    {
      date: '09/01',
      day: 'Monday',
      time: '2:30pm'
    },
    {
      date: '09/01',
      day: 'Monday',
      time: '2:30pm'
    },
    {
      date: '09/01',
      day: 'Monday',
      time: '2:30pm'
    },
    {
      date: '09/01',
      day: 'Monday',
      time: '2:30pm'
    },
    {
      date: '09/01',
      day: 'Monday',
      time: '2:30pm'
    }
  ]
}
