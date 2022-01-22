/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-01-21 11:09:56
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-01-22 15:38:36
 */

import NextLink, { LinkProps } from 'next/link';
import { FC } from 'react';

interface ILinkProps extends LinkProps {
}

const Link: FC<ILinkProps> = ({
  href,
  children,
  ...props
}) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <NextLink {...props} passHref href={href}>
    <a href="replace">{ children }</a>
  </NextLink>
);

export default Link;
