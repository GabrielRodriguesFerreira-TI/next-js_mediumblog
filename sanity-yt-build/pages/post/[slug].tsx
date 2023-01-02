import { GetStaticPaths, GetStaticProps } from "next";
import React, { useState } from "react";
import Header from "../../components/Header";
import { sanityClient, urlFor } from "../../sanity";
import { Post, iForm } from "../../typings";
import Image from "next/image";
import PortableText from "react-portable-text";
import Input from "../../components/Input";
import { useForm } from "react-hook-form";
import { SubmitHandler } from "react-hook-form/dist/types/form";

interface Props {
  post: Post;
}

function Post({ post }: Props) {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<iForm>();

  const onSubmit: SubmitHandler<iForm> = async (data) => {
    await fetch("/api/createComment", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then(() => {
        console.log(data);
        setSubmitted(true);
      })
      .catch((err) => {
        console.log(err);
        setSubmitted(false);
      });
  };

  return (
    <main>
      <Header />

      <Image
        className="w-full h-40 object-cover images"
        width={1200}
        height={40}
        src={urlFor(post.mainImage).url()!}
        alt=""
      />

      <article className="max-w-3xl mx-auto p-5">
        <h1 className="text-3xl mt-10 mb-3">{post.title}</h1>
        <h2 className="text-xl font-light text-gray-500 mb-2">
          {post.description}
        </h2>

        <div className="flex items-center space-x-2">
          <Image
            className="h-10 w-10 rounded-full"
            width={44}
            height={40}
            src={urlFor(post.author.image).url()!}
            alt=""
          />
          <p className="font-extralight text-sm">
            Blog post by{" "}
            <span className="text-green-600">{post.author.name}</span> -
            Publicado em {new Date(post._createdAt).toLocaleString()}
          </p>
        </div>

        <div className="mt-10">
          <PortableText
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
            projectId={process.env.NEXT_PUBLIC_SANITY_DATASET_ID!}
            content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1 className="text-2xl font-bold my-5" {...props} />
              ),
              h2: (props: any) => (
                <h2 className="text-xl font-bold my-5" {...props} />
              ),
              li: ({ children }: any) => (
                <li className="ml-4 list-disc">{children}</li>
              ),
              link: ({ href, children }: any) => (
                <a
                  href={href}
                  className="text-blue-500 cursor-pointer hover:underline"
                >
                  {children}
                </a>
              ),
            }}
          />
        </div>
      </article>

      <hr className="max-w-lg my-5 mx-auto border border-yellow-500" />

      {!submitted ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col p-5 max-w-2xl mx-auto mb-10"
        >
          <h3 className="text-sm text-yellow-500">gostou deste artigo?</h3>
          <h4 className="text-3xl font-bold">Deixe um comentário abaixo!</h4>
          <hr className="py-3 mt-2" />

          <input
            {...register("_id")}
            type="hidden"
            name="_id"
            value={post._id}
          />

          <Input
            register={register("name", { required: true })}
            placeholder="Digite seu nome aqui"
            type="text"
          >
            Name
          </Input>
          <Input
            register={register("email", { required: true })}
            placeholder="Digite seu email aqui"
            type="email"
          >
            Email
          </Input>
          <label className="block mb-5">
            <span className="text-gray-700">Comentario</span>
            <textarea
              {...register("comment", { required: true })}
              className="shadow border rounded py-2 px-3 form-textarea mt-1 block w-full ring-yellow-500 outline-none focus:ring"
              placeholder="Digite seu comentario aqui"
              rows={8}
            />
          </label>

          <div className="flex flex-col p-5">
            {errors.name && (
              <span className="text-red-500">- O Nome obrigatório</span>
            )}
            {errors.email && (
              <span className="text-red-500">- O Email é obrigatório</span>
            )}
            {errors.comment && (
              <span className="text-red-500">
                - O campo de comentario não pode estar vazio
              </span>
            )}
          </div>

          <input
            type="submit"
            className="shadow bg-yellow-500 hover:bg-yellow-400 focus:outline-none text-white font-bold py-2 px-4 rounded cursor-pointer"
          />
        </form>
      ) : (
        <div className="flex flex-col p-10 my-10 bg-yellow-500 text-white max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold">
            Obrigado por deixar o seu comentario!
          </h3>
          <p>Assim que for aprovado, será publicado abaixo!</p>
        </div>
      )}

      <div className="flex flex-col p-10 my-10 max-w-2xl mx-auto shadow-yellow-500 shadow space-y-2">
        <h3 className="text-4xl">Comentarios</h3>
        <hr className="pb-2" />

        {post.comments.map((comment) => (
          <div key={comment._id}>
            <p className="">
              <span className="text-yellow-500">{comment.name}: </span>
              {comment.comment}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Post;

export const getStaticPaths: GetStaticPaths = async () => {
  const query = `*[_type == "post"] {
        _id,
        slug {
          current
        }
      }`;

  const posts = await sanityClient.fetch(query);

  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == "post" && slug.current == $slug] [0] {
        _id,
        _createdAt,
        title,
        author -> {
          name,
          image
        },
        'comments': *[
            _type == "comment" &&
            post._ref == ^._id &&
            approved == true],
        description,
        mainImage,
        slug,
        body
      }`;

  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  });

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
    revalidate: 60, // 1 minuto
  };
};
