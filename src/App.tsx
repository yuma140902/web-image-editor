import { DatePicker } from 'antd'
import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <DatePicker />
      <button onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </button>
    </div>
  )
}

export default App
