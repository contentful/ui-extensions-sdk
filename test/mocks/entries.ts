function yesterday() {
  const now = new Date()
  const oneDayAgo = now.valueOf() - 60 * 60 * 24 * 1000
  return new Date(oneDayAgo).toISOString()
}

const today = new Date().toISOString()

export default {
  total: 36,
  limit: 100,
  skip: 0,
  sys: {
    type: 'Array',
  },
  items: [
    {
      sys: {
        type: 'Entry',
        id: 'b4ltnOQh2HkAFBZVMzdz7',
        createdAt: yesterday(),
      },
    },
    {
      sys: {
        type: 'Entry',
        id: 'V1StGXR8_Z5jdHi6B-myT',
        createdAt: today,
      },
    },
  ],
}
