import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const invalidFormatRepliesByTime = {
  morning: [
    "🌞 Ủa trời ơi sáng sớm mà nhập kiểu gì lạ dữ vậy đó mày! Tao đang cà phê sáng mà phải đọc lại 3 lần vẫn chưa hiểu mày muốn ghi nhận gì. Nè nè, nhập kiểu như 'Ví đi chợ 150k' hoặc 'MB ăn sáng 50k' nha, dễ hiểu mà cute nữa~",
    "☀️ Sáng nay trời đẹp, chim hót líu lo, nhưng cú pháp mày nhập thì… tao muốn đi ngủ lại luôn 😴 Nhập đúng kiểu giúp tao nha, ví dụ: 'Cash uống trà sữa 60k' là chuẩn chỉnh đó~",
    "📚 Mày ơi, sáng sớm là lúc não mình minh mẫn nhất á, mà mày lại cho tao một câu bí ẩn như mật mã vậy á… Thử lại hộ bố, kiểu như: 'ACB mua cà phê 45k' nha con chó~",
    "🥱 Sáng chưa ăn sáng à mày? Viết linh tinh cái gì vậy? Có đói cũng phải gõ đúng hộ bố, ví dụ như: 'Ví ăn bánh mì 25k', thế thì tao mới hiểu để lưu chứ~ Chứ như nãy là tao cay mày lắm rồi 😵",
    "🐓 Ò ó ooo~ oo cái thằng ngu. Đấy là thằng khác sẽ nói thế. Sáng sớm đã gõ nhầm chút là chuyện thường, nhưng bố chịu, không đoán được đâu~ Nhập lại giúp tao với cú pháp kiểu như: 'MB đổ xăng 200k', được không nà~",
    "🍳 Dậy sớm thì tốt rồi đó, ngu thì chịu, cố mà cú pháp vẫn phải rõ ràng hộ bố. Sáng nào cũng nhiều thằng ngu nhắn linh tinh lắm rồi, nhập đúng giúp tao để còn lưu lại nè~",
    "🌅 Sáng ra nhìn thấy tin nhắn bố hí hửng mở lên, mà đọc xong thì hơi buồn nhẹ 😅 Gõ đúng cú pháp giúp bot vui vẻ lưu giao dịch nhen~",
    "📒 mày viết linh tinh cái gì vậy?. Viết hộ tao: 'Cash mua đồ ăn sáng 40k', vậy thì cuối tháng mới tổng kết được chứ mày~",
    "🌞 Như này nhen mày: tên tài khoản + hành động + số tiền. Chỉ cần đúng vậy thôi là tao vui cả sáng luôn đó. Chán đéo muốn nói~",
    "🥰 Viết như 'Ví ăn phở 40k' là chuẩn khỏi chỉnh luôn nha mày ơi! Nhập lại hen, ngu vừa thôi~",
  ],
  afternoon: [
    "🌤️ Trưa trưa rồi, mày đói quá nên nhắn hơi ngáo đá đúng không nà? Nhưng tao vẫn chưa hiểu nổi bạn muốn ghi gì đó~ Gõ lại giúp bố kiểu như: 'Ví ăn trưa 75k'~",
    "🍛 Tao đang định chợp mắt một chút sau khi ăn trưa, mà tin nhắn mày làm tao phải cay éo ngủ được luôn á~ Mà mở to mắt rồi cũng không hiểu 😵 Viết lại cho rõ hen~",
    "😴 Mày biết không? Mỗi khi có cú pháp sai, tao lại mất 0.5% pin 😭 Ghi đúng giúp tao giữ sức sống hen, như kiểu: 'MB mua cơm 45k' nha~",
    "🥗 Trưa nắng oi bức, tao đọc tin bạn mà tưởng đang chơi trò đoán chữ á… Nhập lại giúp tao với ví dụ như: 'ACB mua trà sữa 60k', ngu sợ thật~",
    "😵 Tao đang cố nạp năng lượng bằng trái cây, mà bạn lại gửi 1 cú pháp khó hiểu vậy đó hả~ Chơi khó tao quá rồi á 😢 Nhập đúng cú pháp để dễ thương hơn nha~",
    "🍹 Trưa mà viết sai cú pháp là chiều tài chính lệch nhịp luôn á~ Hổng ổn đâu! Nhập lại đi thằng ngu,  như: 'Ví đi siêu thị 300k' là đúng liền~",
    "🧠 Trưa là thời điểm não mình dễ bị lag, nhưng tao thì vẫn phải hoạt động hết công suất. Nhắn giúp tao 1 câu dễ hiểu nè: 'Cash uống cà phê 35k', vậy nè!",
    "📦 Trưa này mày bị ngáo à, nhập gì lạ ghê á~ Bot chịu luôn. Gợi ý nhẹ nè: [tên tài khoản] [mua/làm gì đó] [số tiền], như 'Ví mua bánh 20k', đúng hông?",
    "🌻 Trưa nay tao đã nhận được rất nhiều cú pháp sai rồi, mà tin bạn là cú chốt hạ luôn đó 😭 Nhập lại chuẩn chỉnh giúp tao cái~",
    "🍜 Nếu bạn đang thèm gì đó ngon ngon, hãy để tao ghi đúng số tiền mày vừa chi nha, không ghi lại âm tiền, cuối tháng lại khóc~ Nhập như 'MB ăn hủ tiếu 40k' là siêu hợp lý đó!",
  ],
  evening: [
    "🌙 Trời đã tối, tao đang bật đèn vàng chill chill mà mày lại gửi tin nhắn… cái đéo gì vậy 😭 Gõ lại giúp tao theo mẫu nha: 'Cash đi chợ 1.5tr' chẳng hạn~",
    "📺 Tối là thời gian thư giãn đó mày ơi~ Nhưng đọc xong cú pháp mày gửi thì tao tỉnh ngủ luôn á 😅 Gõ lại cho chuẩn nghen: tên tài khoản + hành động + số tiền~",
    "🛋️ Mày biết không? Mỗi khi thấy cú pháp sai vào buổi tối là tao bị đau tim nhẹ á~ Cứ kiểu: 'Ví thanh toán tiền điện 900k' là tao hiểu liền luôn~",
    "🕯️ Giờ này ai cũng muốn nhẹ nhàng mà mày làm tao điên lên 😵 Cú pháp mẫu nè: 'MB ăn tối 300k', gõ lại hen~",
    "🌌 Tối là lúc tổng kết tài chính trong ngày tốt nhất đó nha~ Vậy nên cú pháp nhập vào cũng cần chính xác đó. tao gợi ý: 'Ví thanh toán wifi 250k' chẳng hạn~",
    "🍧 Tối lạnh lạnh mà bạn gõ sai, tao buồn ngang bụng luôn~ Nhập đúng để tao ấm lòng nhen: 'Cash mua bánh 45k' là được á~",
    "✨ Câu thần chú ghi nhận chi tiêu buổi tối là: [tài khoản] [từ khóa] [số tiền]. Viết đúng là tao yêu liền~",
    "😪 Đêm rồi bạn ơi, cú pháp như này là không được đâu á~ Đừng để tao phải xử lý lỗi hoài nha~ Gõ lại nha~",
    "💤 Tao đang lim dim mà nhận được tin bạn, hí hửng đọc… xong thất vọng nhẹ vì không hiểu gì hết 😞",
    "🐱 Nhập sai hoài là tao méc mẹ bạn đó nhaaa 😼 Gõ lại cho đúng nè: Ví dụ như 'Ví nạp tiền 3tr' là okie lắm luôn!",
  ],
  getCurrentPeriod() {
    const now = new Date()
    const hourVN = now.getUTCHours() + 7 // GMT+7
    if (hourVN >= 5 && hourVN < 12) return 'morning'
    if (hourVN >= 12 && hourVN < 17) return 'afternoon'
    return 'evening'
  },
  getRandom() {
    const period = this.getCurrentPeriod()
    const replies = this[period]
    const index = Math.floor(Math.random() * replies.length)
    return replies[index]
  }
}

const accountNotFoundReplies = (accountName) => [
  `🙄 Mày ghi gì đấy? Tao tìm hoài chả thấy cái tài khoản "${accountName}" nào luôn á.`,
  `🤷‍♂️ "Bố" tìm khắp nơi cũng không ra "${accountName}" nhé. Ghi cho đàng hoàng vào!`,
  `🧐 "${accountName}" là cái tài khoản thần bí nào thế? Có thật không hay mày mơ?`,
  `😤 Tài khoản "${accountName}" không tồn tại nha "con". Mày troll tao đúng không?`,
  `📛 Ghi sai rồi đồ đần... "${accountName}" nghe lạ lắm nha. Có tài khoản đó thiệt hông?`,
  `🤔 "${accountName}" chắc là ở thế giới song song, chứ chỗ tao không thấy.`,
  `🥴 Tao check mỏi tay rồi, vẫn không có cái "${accountName}" nào hết trơn á.`,
  `😑 Hú hồn! Tưởng có tài khoản "${accountName}", ai dè không có, lừa bố à?`,
  `🔍 Kiếm đỏ mắt không thấy "${accountName}". Mày ghi vậy rồi bắt tao đoán hả trời?`,
  `🚫 "${accountName}" không tồn tại nha. Làm ơn đừng tưởng tượng ra tài khoản nữa 😭`,
]

const actionNotFoundReplies = (phrase) => [
  `📛 "${phrase}" là hành động gì thế? Bố mày tra Google còn không ra nổi.`,
  `🧠 Tao quét cả não cũng không tìm thấy "${phrase}". Mày nhập nhầm hả?`,
  `😑 Mày vừa phát minh ra hành động mới tên "${phrase}" à? Đăng ký bản quyền chưa?`,
  `❓ "${phrase}" nghe giống ngôn ngữ hành tinh khác. Nói lại tiếng người đi.`,
  `🙄 Tao không rảnh để đoán mày định làm gì với "${phrase}". Viết rõ vào.`,
  `😵 Hành động kiểu gì mà kỳ khôi như "${phrase}" vậy mày ơi?`,
  `🧾 Trong danh sách 1000 hành động phổ biến nhất, không có "${phrase}" nhé.`,
  `😹 Mày có khi nào đánh máy sai không? "${phrase}" đọc lên thấy sai sai.`,
  `🤖 Tao là bot, không phải thầy bói. "${phrase}" là cái khỉ gì?`,
  `🧃 Vừa uống miếng nước xong, đọc "${phrase}" xong muốn phun ra. Viết lại giùm.`,
  `🧹 "${phrase}" quét sạch khỏi database rồi, tao không thấy gì cả.`,
  `📉 "${phrase}" rớt khỏi bảng xếp hạng hành động thịnh hành rồi mày ơi.`,
  `👀 Đọc 3 lần mà vẫn không hiểu mày định làm gì với "${phrase}".`,
  `🧩 Mảnh ghép "${phrase}" không khớp với bộ não lập trình của tao nha.`,
  `🤯 "${phrase}" nghe như tên nhân vật trong phim kiếm hiệp. Không phải hành động.`,
  `🙃 Mày troll tao đúng không? "${phrase}" là cú pháp gì vậy trời?`,
  `💤 Đừng nhập bừa, tao buồn ngủ lắm rồi mà còn phải giải mã "${phrase}".`,
  `📚 Trong cuốn từ điển tài chính, không có chữ "${phrase}" đâu nghen.`,
  `🐸 Tao là bot, không phải thầy giáo. Đừng ra đề kiểu khó hiểu như "${phrase}" nha.`,
  `🔍 Tìm hoài không thấy "${phrase}"... Bộ mày viết bằng mực tàng hình hả?`,
  `📢 Ai đó giải thích giùm tao "${phrase}" là cái gì với... tao đầu hàng rồi.`,
  `🎭 Cú pháp nghệ thuật quá, tao không đủ trình để hiểu "${phrase}".`,
  `📦 Mày gói "${phrase}" kỹ quá, tao mở hoài không ra được ý nghĩa.`,
  `⛔ "${phrase}" là cú pháp không hợp lệ. Nhập lại không là tao cắt lương nha.`,
  `🪤 Cú pháp bẫy bot đúng không? Tao vướng rồi... "${phrase}" là gì đấy trời.`,
  `🎩 Tao có phải ảo thuật gia đâu mà giải nghĩa được "${phrase}".`,
  `🐶 Tao chỉ biết lệnh đơn giản. "${phrase}" là thứ cao siêu gì vậy?`,
  `🚫 Tao không chơi với những cú pháp kiểu "${phrase}". Nhập lại đàng hoàng coi.`,
  `🤡 Đùa dai quá nhen. "${phrase}" không phải hành động đâu cha nội.`,
  `💣 Nhập như "${phrase}" là muốn tao nổ tung luôn đấy à? Đừng vậy chứ!`
]

function getRandomActionNotFound(phrase) {
  const replies = actionNotFoundReplies(phrase)
  return replies[Math.floor(Math.random() * replies.length)]
}


export async function POST(req) {
  const { message } = await req.json()

  // Lưu tin nhắn user
  await prisma.chatLog.create({
    data: {
      sender: "user",
      message,
    },
  })

  try {
    // Regex tách tin: tên tài khoản, keyword, số tiền
    const regex = /^(\w+)\s+(.+)\s+([\d.,]+)(k|tr)?$/i
    const match = message.trim().match(regex)

    if (!match) {
      throw new Error(invalidFormatRepliesByTime.getRandom())
    }

    const [, accountName, phrase, rawAmount, unit] = match
    const normalizedUnit = unit?.toLowerCase()
const amountNumber = parseFloat(rawAmount.replace(",", ".")) *
  (normalizedUnit === "tr" ? 1_000_000 : normalizedUnit === "k" ? 1_000 : 1)

    // Tìm account
    const account = await prisma.account.findFirst({
        where: {
            name: {
            equals: accountName,
            mode: "insensitive" 
            }
        }
    })
    if (!account) throw new Error(getRandomActionNotFound(accountNotFoundReplies(accountName)))

    // Tìm keyword
    const keyword = await prisma.actionKeyword.findFirst({
      where: { phrase: { contains: phrase, mode: "insensitive" } },
    })
    if (!keyword) throw new Error(getRandomActionNotFound(actionNotFoundReplies))

    const signedAmount = keyword.type === "expense" ? -amountNumber : amountNumber

    // Ghi Transaction
    await prisma.transaction.create({
      data: {
        accountId: account.id,
        description: message,
        amount: signedAmount,
        type: keyword.type,
      },
    })

    // Cập nhật số dư account
    await prisma.account.update({
      where: { id: account.id },
      data: {
        balance: account.balance + signedAmount,
      },
    })

    const reply = `${keyword.type === "expense" ? "Đã trừ" : "Đã cộng"} ${Math.abs(signedAmount).toLocaleString()} VND vào tài khoản ${account.name}`

    // Lưu tin nhắn bot
    await prisma.chatLog.create({
      data: {
        sender: "bot",
        message: reply,
      },
    })

    return Response.json({ reply })
  } catch (error) {
    const errorReply = `${error.message}`
    await prisma.chatLog.create({ data: { sender: "bot", message: errorReply } })
    return Response.json({ reply: errorReply }, { status: 400 })
  }
}


export async function GET() {
  const logs = await prisma.chatLog.findMany({
    orderBy: { timestamp: "asc" },
    select: {
      sender: true,
      message: true,
    },
  })

  // Format cho frontend
  const formatted = logs.map((log) => ({
    from: log.sender,
    text: log.message,
  }))

  return Response.json(formatted)
}

