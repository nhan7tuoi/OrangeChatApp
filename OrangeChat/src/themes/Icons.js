import React from "react";
import caNhan from "../assets/svgs/caNhan.svg";
import caNhan2 from "../assets/svgs/caNhan2.svg";
import danhBa from "../assets/svgs/danhBa.svg";
import danhBa2 from "../assets/svgs/danhBa2.svg";
import friends from "../assets/svgs/friends.svg";
import iconBack from "../assets/svgs/iconBack.svg";
import iconCall from "../assets/svgs/iconCall.svg";
import iconFile from "../assets/svgs/iconFile.svg";
import iconIcon from "../assets/svgs/iconIcon.svg";
import iconImage from "../assets/svgs/iconImage.svg";
import iconOther from "../assets/svgs/iconOther.svg";
import iconSend from "../assets/svgs/iconSend.svg";
import iconVideoCall from "../assets/svgs/iconVideoCall.svg";
import nhom from "../assets/svgs/nhom.svg";
import nhom2 from "../assets/svgs/nhom2.svg";
import  taiKhoan from "../assets/svgs/taiKhoan.svg";
import taiKhoan2 from "../assets/svgs/taiKhoan2.svg";
import search from "../assets/svgs/search.svg";
import iconTym from "../assets/svgs/iconTym.svg";
import haha from "../assets/svgs/haha.svg";
import like from "../assets/svgs/like.svg";
import love from "../assets/svgs/love.svg";
import sad from "../assets/svgs/sad.svg";
import wow from "../assets/svgs/wow.svg";
import angry from "../assets/svgs/angry.svg";
const SVGs = {
    caNhan,
    caNhan2,
    danhBa,
    danhBa2,
    friends,
    iconBack,
    iconCall,
    iconFile,
    iconIcon,
    iconImage,
    iconOther,
    iconSend,
    iconVideoCall,
    nhom,
    nhom2,
    taiKhoan,
    taiKhoan2,
    search,
    iconTym,
    haha,
    like,
    love,
    sad,
    wow,
    angry
}

export default {
    Icons: ({ name = "", width, height }) => {
        if(name in SVGs) {
            const Icons = SVGs[name]
            return <Icons width={width} height={height} />
        }else {
            return null;
        }
    }
}