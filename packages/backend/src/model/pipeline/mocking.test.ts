import { Mock, Times, It } from "moq.ts"

describe("Mock library", () => {
  it("should mock promises", async () => {
    interface Panda {
      f(a: number, b: number): Promise<number>
    }

    const pandaMock = new Mock<Panda>()
      .setup((instance) => instance.f(It.IsAny(), It.IsAny()))
      .returns(Promise.resolve(90))

    const panda = pandaMock.object()

    const value = await panda.f(8, 5)

    expect(value).toBe(90)

    pandaMock.verify((instance) => instance.f(It.IsAny(), 5), Times.Once())
  })
})
