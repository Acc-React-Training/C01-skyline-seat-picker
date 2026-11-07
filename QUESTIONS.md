# Review Questions

Answer each question before opening its answer. They reinforce the concepts used in this challenge: `useState`, props & components, and event handling.

---

## 1. What does the button show after one click?

```jsx
function ScoreBoard() {
  const [score, setScore] = useState(0);

  function handleBonus() {
    setScore(score + 1);
    setScore(score + 1);
    setScore(score + 1);
  }

  return <button onClick={handleBonus}>Score: {score}</button>;
}
```

<details>
<summary>Answer</summary>

It shows **`Score: 1`**, not 3.

State works like a snapshot: during this render, `score` is `0`, and it doesn't change inside the handler. The three calls are the same as calling `setScore(0 + 1)` three times.

To update state based on its previous value, pass an **updater function**. React queues the updaters and runs them in order:

```jsx
function handleBonus() {
  setScore((s) => s + 1);
  setScore((s) => s + 1);
  setScore((s) => s + 1); // Score: 3
}
```

📚 Learn more:

- [State as a Snapshot](https://react.dev/learn/state-as-a-snapshot)
- [Queueing a Series of State Updates](https://react.dev/learn/queueing-a-series-of-state-updates)

</details>

---

## 2. Which of these updates will show `"css"` on the screen?

```jsx
const [tags, setTags] = useState(["react", "javascript"]);

// A
tags.push("css");
setTags(tags);

// B
setTags([...tags, "css"]);

// C
setTags(tags.concat("css"));

// D
const copy = tags;
copy.push("css");
setTags(copy);
```

<details>
<summary>Answer</summary>

**B and C.**

React compares the old and new state with `Object.is`. In **A** and **D**, `push` changes the existing array and `setTags` receives the **same reference** (in D, `copy` is just another name for `tags`). React sees no change and skips the re-render.

**B** and **C** create a **new array**, so React detects the change. Treat state as read-only: use methods that return a new array (`[...arr]`, `concat`, `filter`, `map`) instead of methods that mutate it (`push`, `splice`, `sort`).

📚 Learn more:

- [Updating Arrays in State](https://react.dev/learn/updating-arrays-in-state)

</details>

---

## 3. What's wrong with this component, and how would you fix it?

```jsx
function Badge(props) {
  props.label = props.label.toUpperCase();
  if (!props.color) {
    props.color = "gray";
  }

  return <span className={`badge badge-${props.color}`}>{props.label}</span>;
}
```

<details>
<summary>Answer</summary>

It changes its own props. Props are **read-only**: a component receives them from its parent and must not modify them (in development, React freezes the props object, so this code throws an error).

Calculate new values in local variables, and use **default values** in the destructuring for optional props:

```jsx
function Badge({ label, color = "gray" }) {
  const text = label.toUpperCase();
  return <span className={`badge badge-${color}`}>{text}</span>;
}
```

If a value needs to change over time, the parent should keep it in state and pass the new value as a prop.

📚 Learn more:

- [Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component)
- [Keeping Components Pure](https://react.dev/learn/keeping-components-pure)

</details>

---

## 4. Which button calls `onLike` during render, and which one calls it with the right argument?

```jsx
function LikeButtons({ postId, onLike }) {
  return (
    <>
      <button onClick={onLike}>A</button>
      <button onClick={onLike(postId)}>B</button>
      <button onClick={() => onLike(postId)}>C</button>
    </>
  );
}
```

<details>
<summary>Answer</summary>

- **A** passes the function. It runs on click, but it receives the **click event** as its argument, not `postId`.
- **B** **calls** `onLike` during render, every time the component renders, and passes its return value (usually `undefined`) as the handler. Nothing happens on click. If `onLike` updates state, this can cause an infinite loop.
- **C** is correct. It passes a new function that runs on click and calls `onLike` with `postId`.

Remember: pass a function (`onClick={fn}` or `onClick={() => fn(arg)}`), don't call it (`onClick={fn()}`).

📚 Learn more:

- [Responding to Events – Adding event handlers](https://react.dev/learn/responding-to-events#adding-event-handlers)

</details>

---

## 5. When the user switches to another contact, the text they were typing stays in the box. Why, and how can you reset it?

```jsx
function Chat({ contact }) {
  const [draft, setDraft] = useState("");

  return (
    <>
      <h2>Message to {contact.name}</h2>
      <textarea value={draft} onChange={(e) => setDraft(e.target.value)} />
    </>
  );
}

// In the parent:
<Chat contact={selectedContact} />;
```

<details>
<summary>Answer</summary>

React keeps a component's state as long as the **same component** is rendered in the **same position** of the tree. When `selectedContact` changes, it's still the same `<Chat>` in the same place, so only its props change and `draft` keeps its value.

To tell React that each contact should get its own `Chat`, give it a **`key`**. When the key changes, React creates a new component with fresh state:

```jsx
<Chat key={selectedContact.id} contact={selectedContact} />
```

📚 Learn more:

- [Preserving and Resetting State](https://react.dev/learn/preserving-and-resetting-state)

</details>
