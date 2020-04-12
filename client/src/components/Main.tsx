import React, {useEffect} from "react";
import styled from "styled-components";
import {Navbar} from "./Navbar";
import {useDispatch, useSelector} from "react-redux";
import {addBooks} from "../actions/bookActions";
import {RootState} from "../store";

const Main = () => {
	const dispatch = useDispatch();
	const books = useSelector((state: RootState) => state.bookReducer.books);

	useEffect(() => {
		const token = localStorage.getItem("x-token");

		if (token) {
			const h = new Headers({
				"x-token": token,
			});

			fetch("http://localhost:5000/api/books", {
				headers: h,
			})
				.then(res => res.json())
				.then(data => dispatch(addBooks(data)))
				.catch(err => console.error(err));
		}
	}, []);

	return (
		<Wrapper>
			<Navbar />
			<h1>This is home.</h1>
			<ul>
				{books.map((book: {id: number; name: string}) => (
					<li key={book.id}>{book.name}</li>
				))}
			</ul>
		</Wrapper>
	);
};

export default Main;

const Wrapper = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;

	h1 {
		padding: 5em;
	}
`;
