import React from "react";

export default function App({ assets }) {
	const [count, setCount] = React.useState(0);
	return (
		<html lang="en">
			<head>
				<link rel="icon" href="/favicon.ico" />
				{assets}
			</head>
			<body>
				<section>
					<h1 data-test-id="content">Hello from Vinxi</h1>
					<button onClick={() => setCount(count + 1)}>
						Click me: {count}!
					</button>
				</section>
			</body>
		</html>
	);
}
