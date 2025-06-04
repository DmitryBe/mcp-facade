from mcp.server.fastmcp import FastMCP

mcp = FastMCP(name="MathServer", stateless_http=True)

@mcp.tool(description="A simple add tool")
def add(a: int, b: int) -> int:
    return a + b

@mcp.tool(description="A simple subtract tool")
def subtract(a: int, b: int) -> int:
    return a - b

@mcp.tool(description="A simple multiply tool")
def multiply(a: int, b: int) -> int:
    return a * b

@mcp.tool(description="A simple divide tool")
def divide(a: int, b: int) -> int:
    return a / b

if __name__ == "__main__":
    mcp.run(transport="streamable-http")