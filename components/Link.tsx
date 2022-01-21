/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-01-21 11:09:56
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-01-21 11:24:20
 */

import NextLink, { LinkProps } from 'next/link';
import { FC } from 'react';

interface ILinkProps extends LinkProps {
  title: string;
}

const Link: FC<ILinkProps> = ({
  title,
  ...props
}) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <NextLink {...props} passHref>
    <a href="replace">{ title }</a>
  </NextLink>
);

export default Link;
